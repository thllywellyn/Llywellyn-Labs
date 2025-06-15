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
    const { userId, role } = body

    // Validate role
    if (!['ADMIN', 'CLIENT'].includes(role)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid role' }),
        { status: 400 }
      )
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Cannot change your own role' }),
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return new NextResponse(JSON.stringify(updatedUser))
  } catch (error) {
    console.error('Error updating user role:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
