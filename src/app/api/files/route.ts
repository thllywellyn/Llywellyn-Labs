import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'default', // you can customize this
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

    const formData = await request.formData()
    const files = formData.getAll('file') as File[]
    const projectId = formData.get('projectId') as string

    if (files.length === 0 || !projectId) {
      return new NextResponse(JSON.stringify({ error: 'At least one file and projectId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return new NextResponse(JSON.stringify({ 
          error: `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return new NextResponse(JSON.stringify({ 
          error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          { user: { role: 'ADMIN' } }
        ]
      }
    })

    if (!project) {
      return new NextResponse(JSON.stringify({ error: 'Project not found or access denied' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Process files in parallel
    const filePromises = files.map(async (file) => {
      try {
        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64File = `data:${file.type};base64,${buffer.toString('base64')}`

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(base64File, {
            resource_type: 'auto',
            folder: `projects/${projectId}`,
            allowed_formats: ALLOWED_FILE_TYPES.map(type => type.split('/')[1]),
            tags: ['project_file'],
          }, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        }) as { secure_url: string, public_id: string }

        // Save file info to database
        return await prisma.file.create({
          data: {
            name: file.name,
            url: uploadResult.secure_url,
            projectId,
            metadata: {
              size: file.size,
              type: file.type,
              publicId: uploadResult.public_id
            }
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          }
        })
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        throw error
      }
    })

    // Wait for all files to be processed
    const savedFiles = await Promise.all(filePromises)

    return NextResponse.json(savedFiles)
  } catch (error) {
    console.error('Error in POST /api/files:', error)
    
    // Handle specific error types
    if (error instanceof CloudinaryError) {
      return new NextResponse(JSON.stringify({ error: 'File upload failed. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new NextResponse(JSON.stringify({ error: 'A file with this name already exists' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
