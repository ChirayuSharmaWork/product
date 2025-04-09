"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useProducts } from "@/contexts/product-context"
import { Download } from "lucide-react"

export function ImportFakeStoreButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { getProducts } = useProducts()

  const handleImport = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/import-fakestore", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to import products")
      }

      toast({
        title: "Success!",
        description: data.message,
      })

      // Refresh products after import
      await getProducts(true)

      // Refresh the page to show the new products
      router.refresh()
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleImport} disabled={isLoading} className="flex items-center gap-2">
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Importing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Import from FakeStore API
        </>
      )}
    </Button>
  )
}
