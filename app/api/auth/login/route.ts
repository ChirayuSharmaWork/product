import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { comparePassword } from "@/lib/password"
import { login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Check if the password is correct
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Create a JWT token
    const { password: _, ...userWithoutPassword } = user
    const token = await login(userWithoutPassword)

    return NextResponse.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
