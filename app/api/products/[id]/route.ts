import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Correctly access the id from params
    const id = context.params.id

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if the user has permission to view this product
    if (product.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = context.params
    const { name, description, price, category, rating, imageUrl } = await request.json()

    // Check if the product exists and belongs to the user
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Only allow the owner or admin to update the product
    if (existingProduct.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to update this product" }, { status: 403 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        category,
        rating: rating ? Number.parseFloat(rating) : existingProduct.rating,
        imageUrl,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = context.params

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Log debugging information
    console.log("Delete request details:", {
      productId: id,
      productUserId: existingProduct.userId,
      sessionUserId: session.id,
      userRole: session.role,
      isOwner: existingProduct.userId === session.id,
      isAdmin: session.role === "ADMIN",
    })

    // Only allow the owner or admin to delete the product
    if (existingProduct.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "You don't have permission to delete this product",
          details: {
            productOwner: existingProduct.userId,
            currentUser: session.id,
            userRole: session.role,
          },
        },
        { status: 403 },
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
