"use client"

import { useState, createContext, useContext } from "react"

type ToastVariant = "default" | "destructive"

type Toast = {
  title: string
  description: string
  variant?: ToastVariant
}

type ToastContextType = {
  currentToast: Toast | null
  toast: (toast: Toast) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToastProvider() {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const toast = (toast: Toast) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set the toast
    setCurrentToast(toast)

    // Auto-hide after 5 seconds
    const id = setTimeout(() => {
      setCurrentToast(null)
    }, 5000)

    setTimeoutId(id)
  }

  const hideToast = () => {
    setCurrentToast(null)
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  return {
    currentToast,
    toast,
    hideToast,
  }
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ToastContext.Provider
