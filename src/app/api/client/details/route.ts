import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await request.json()
    
    // Update user profile with business details
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        businessDetails: data, // This will be stored in a JSON field
        onboardingCompleted: true,
      },
    })

    // Create an initial project for the client
    await prisma.project.create({
      data: {
        title: 'Welcome Project',
        description: `Initial project for ${data.businessName}. Here you'll find project updates and files related to your services.`,
        userId: session.user.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error in POST /api/client/details:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
