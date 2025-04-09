import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("API: GET /api/products - Processing request")
    const session = await getSession()

    if (!session || !session.id) {
      console.log("API: GET /api/products - Not authenticated")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const url = new URL(request.url)

    // Parse query parameters for filtering
    const category = url.searchParams.get("category")
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")
    const minRating = url.searchParams.get("minRating")
    const search = url.searchParams.get("search")

    console.log("API: GET /api/products - Filters", { category, minPrice, maxPrice, minRating, search })

    // Build the where clause for filtering
    const where: any = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number.parseFloat(minPrice)
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice)
    }

    if (minRating) {
      where.rating = { gte: Number.parseFloat(minRating) }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    console.log("API: GET /api/products - Executing query with where clause", where)

    try {
      // Get products
      const products = await prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      })

      console.log(`API: GET /api/products - Found ${products.length} products`)

      // Set cache control headers to prevent caching
      return NextResponse.json(products, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    } catch (dbError) {
      console.error("API: GET /api/products - Database error:", dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
  } catch (error) {
    console.error("API: GET /api/products - Unhandled error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name, description, price, category, rating, imageUrl } = await request.json()

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        category,
        rating: rating ? Number.parseFloat(rating) : 0,
        imageUrl,
        userId: session.id,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
