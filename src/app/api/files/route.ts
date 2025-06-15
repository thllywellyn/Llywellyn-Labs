import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary error type
interface CloudinaryError extends Error {
  http_code?: number;
  message: string;
}

cloudinary.config({
  cloud_name: 'durqsthnq',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const projectId = searchParams.get('projectId')

    const files = await prisma.file.findMany({
      where: {
        project: {
          userId: session.user.id,
        },
        ...(projectId && { projectId }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit && { take: parseInt(limit) }),
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error in GET /api/files:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Project ID is required
    const formData = await request.formData()
    const projectId = formData.get('projectId')

    if (!projectId) {
      return new NextResponse(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get the file from form data
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return new NextResponse(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Convert file to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get custom name or use original filename
    const customName = formData.get('customName') as string || file.name

    // Upload to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `lsanalab/projects/${projectId}`,
          public_id: customName.replace(/\.[^/.]+$/, ''), // Remove extension for public_id
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

    if (!uploadResponse || !uploadResponse.secure_url) {
      throw new Error('File upload failed')
    }

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name: customName,
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        size: file.size,
        type: file.type,
        projectId: projectId as string,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(fileRecord)

  } catch (error) {
    console.error('File upload error:', error)
    
    // Handle specific error types
    if (error && typeof error === 'object' && 'http_code' in error) {
      // This is likely a Cloudinary error
      return new NextResponse(JSON.stringify({ 
        error: 'File upload failed. Please try again.',
        details: (error as Error).message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generic error response
    return new NextResponse(JSON.stringify({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
