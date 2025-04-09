// FakeStore API service
// Documentation: https://fakestoreapi.com/docs

export type FakeStoreProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export async function fetchFakeStoreProducts(): Promise<FakeStoreProduct[]> {
  const response = await fetch("https://fakestoreapi.com/products")
  if (!response.ok) {
    throw new Error("Failed to fetch products from FakeStore API")
  }
  return response.json()
}

export async function fetchFakeStoreProduct(id: number): Promise<FakeStoreProduct> {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id} from FakeStore API`)
  }
  return response.json()
}

export async function fetchFakeStoreCategories(): Promise<string[]> {
  const response = await fetch("https://fakestoreapi.com/products/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories from FakeStore API")
  }
  return response.json()
}

// Convert FakeStore product to our app's product format
export function convertFakeStoreProduct(product: FakeStoreProduct, userId: string) {
  return {
    name: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    rating: product.rating.rate,
    imageUrl: product.image,
    userId,
  }
}
