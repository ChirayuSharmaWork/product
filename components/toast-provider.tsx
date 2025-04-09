"use client"

import type React from "react"

import { useToastProvider, ToastProvider as ToastContextProvider } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastContext = useToastProvider()

  return (
    <ToastContextProvider value={toastContext}>
      {children}

      {toastContext.currentToast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Toast variant={toastContext.currentToast.variant}>
            <div>
              <ToastTitle>{toastContext.currentToast.title}</ToastTitle>
              <ToastDescription>{toastContext.currentToast.description}</ToastDescription>
            </div>
            <ToastClose onClick={toastContext.hideToast} />
          </Toast>
        </div>
      )}
    </ToastContextProvider>
  )
}
