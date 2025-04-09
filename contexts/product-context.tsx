"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  rating: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
  userId: string
}

type ProductFilters = {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  search?: string
}

type ProductContextType = {
  products: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  setFilters: (filters: ProductFilters) => void
  getProducts: () => Promise<void>
  getProduct: (id: string) => Promise<Product | null>
  createProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<Product | null>
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})

  const getProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build the query string from filters
      const queryParams = new URLSearchParams()

      if (filters.category && filters.category !== "all") {
        queryParams.append("category", filters.category)
      }

      if (filters.minPrice !== undefined) {
        queryParams.append("minPrice", filters.minPrice.toString())
      }

      if (filters.maxPrice !== undefined) {
        queryParams.append("maxPrice", filters.maxPrice.toString())
      }

      if (filters.minRating !== undefined) {
        queryParams.append("minRating", filters.minRating.toString())
      }

      if (filters.search) {
        queryParams.append("search", filters.search)
      }

      const queryString = queryParams.toString()
      const url = `/api/products${queryString ? `?${queryString}` : ""}`

      const res = await fetch(url)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to fetch products")
      }

      const data = await res.json()
      setProducts(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch products")
      console.error("Get products error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProduct = async (id: string): Promise<Product | null> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/products/${id}`)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to fetch product")
      }

      const data = await res.json()
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch product")
      console.error("Get product error:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt" | "userId">,
  ): Promise<Product | null> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product")
      }

      // Update the products list
      setProducts((prevProducts) => [...prevProducts, data])

      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create product")
      console.error("Create product error:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product")
      }

      // Update the products list
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === id ? data : p)))

      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update product")
      console.error("Update product error:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403) {
          setError("You don't have permission to delete this product")
          return false
        } else if (response.status === 404) {
          setError("Product not found or already deleted")
          return false
        } else {
          setError(data.error || "Failed to delete product")
          return false
        }
      }

      // Remove the deleted product from the state
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      return true
    } catch (error) {
      console.error("Delete product error:", error)
      setError("An unexpected error occurred. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Load products when filters change
  useEffect(() => {
    getProducts()
  }, [filters])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        filters,
        setFilters,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
