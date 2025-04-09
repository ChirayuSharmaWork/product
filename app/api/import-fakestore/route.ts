import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { fetchFakeStoreProducts, convertFakeStoreProduct } from "@/lib/fakestore-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch products from FakeStore API
    const fakeStoreProducts = await fetchFakeStoreProducts()

    // Convert and save products to our database
    const createdProducts = []

    for (const fakeProduct of fakeStoreProducts) {
      const productData = convertFakeStoreProduct(fakeProduct, session.id)

      // Check if product with similar name already exists
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: productData.name,
          userId: session.id,
        },
      })

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: productData,
        })
        createdProducts.push(product)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${createdProducts.length} products from FakeStore API`,
      products: createdProducts,
    })
  } catch (error) {
    console.error("Import FakeStore products error:", error)
    return NextResponse.json({ error: "Failed to import products from FakeStore API" }, { status: 500 })
  }
}
