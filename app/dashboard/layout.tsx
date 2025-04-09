"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProductProvider } from "@/contexts/product-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ToastProvider } from "@/components/toast-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <ProductProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <header className="border-b">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-xl font-bold">
                  Product Management
                </Link>
                <nav className="hidden md:flex gap-6">
                  <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/products" className="text-sm font-medium transition-colors hover:text-primary">
                    Products
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {user.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </ToastProvider>
    </ProductProvider>
  )
}
