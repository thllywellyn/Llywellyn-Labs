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
    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get total projects count
    const totalProjects = await prisma.project.count()

    // Get active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    return new NextResponse(
      JSON.stringify({
        totalUsers,
        totalProjects,
        activeUsers
      })
    )
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
