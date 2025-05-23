import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    emailVerified?: Date | null
  }
  
  interface Session {
    user: User & {
      role?: string
      emailVerified?: Date | null
    }
  }
}
