import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { projectId, status } = body

    // Validate status
    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid status' }),
        { status: 400 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return new NextResponse(JSON.stringify(updatedProject))
  } catch (error) {
    console.error('Error updating project status:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
