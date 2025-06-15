import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  try {
    // Get recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    })

    // Get recent projects
    const recentProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // Combine and format activity
    const activity = [
      ...recentUsers.map(user => ({
        id: user.id,
        type: 'USER_JOINED' as const,
        description: `${user.name} joined the platform`,
        timestamp: user.createdAt.toISOString()
      })),
      ...recentProjects.map(project => ({
        id: project.id,
        type: 'PROJECT_CREATED' as const,
        description: `${project.user.name} created project "${project.title}"`,
        timestamp: project.createdAt.toISOString()
      }))
    ].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10)

    return new NextResponse(JSON.stringify(activity))
  } catch (error) {
    console.error('Error fetching admin activity:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
