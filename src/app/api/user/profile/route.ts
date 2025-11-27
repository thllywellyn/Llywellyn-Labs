import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        displayName: true,
        profileImage: true,
        bio: true,
        phone: true,
        companyName: true,
        jobTitle: true,
        website: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        github: true,
        emailNotifications: true,
        marketingEmails: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate email uniqueness if email is being changed
    if (body.email && body.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        displayName: body.displayName || undefined,
        profileImage: body.profileImage || undefined,
        profileImagePublicId: body.profileImagePublicId || undefined,
        bio: body.bio || undefined,
        phone: body.phone || undefined,
        companyName: body.companyName || undefined,
        jobTitle: body.jobTitle || undefined,
        website: body.website || undefined,
        addressLine1: body.addressLine1 || undefined,
        addressLine2: body.addressLine2 || undefined,
        city: body.city || undefined,
        state: body.state || undefined,
        postalCode: body.postalCode || undefined,
        country: body.country || undefined,
        linkedin: body.linkedin || undefined,
        twitter: body.twitter || undefined,
        instagram: body.instagram || undefined,
        github: body.github || undefined,
        emailNotifications: body.emailNotifications !== undefined ? body.emailNotifications : undefined,
        marketingEmails: body.marketingEmails !== undefined ? body.marketingEmails : undefined,
        email: body.email || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        displayName: true,
        profileImage: true,
        bio: true,
        phone: true,
        companyName: true,
        jobTitle: true,
        website: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        github: true,
        emailNotifications: true,
        marketingEmails: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
