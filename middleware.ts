import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Skip auth for login and signup routes
    if (request.nextUrl.pathname === "/api/auth/login" || request.nextUrl.pathname === "/api/auth/signup") {
      return NextResponse.next()
    }

    // Check for the token
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify the token
      const payload = await decrypt(token)

      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Continue to the API route
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }

  // For protected pages
  if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/products")) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    try {
      const payload = await decrypt(token)

      if (!payload) {
        const url = new URL("/login", request.url)
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/products/:path*"],
}
