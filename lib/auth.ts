import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "@prisma/client"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Token decryption error:", error)
    return null
  }
}

export async function login(user: Omit<User, "password">) {
  // Create a JWT token
  const token = await encrypt({
    id: user.id,
    email: user.email,
    role: user.role || "USER", // Ensure role is always set
  })

  // Save the token in a cookie
  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })

  return token
}

export async function logout() {
  // Remove the token cookie
  const cookieStore = await cookies()
  cookieStore.delete("token")
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  const payload = await decrypt(token)

  // Log session details for debugging
  console.log("Session details:", {
    userId: payload?.id,
    userEmail: payload?.email,
    userRole: payload?.role,
  })

  return payload
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return false
  }

  const payload = await decrypt(token)
  return payload
}
