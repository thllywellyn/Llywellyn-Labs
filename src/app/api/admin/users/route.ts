import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return new NextResponse(JSON.stringify(users))
  } catch (error) {
    console.error('Error fetching users:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
