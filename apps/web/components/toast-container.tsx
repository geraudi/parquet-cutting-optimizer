"use client"

import { Toaster } from "@workspace/ui/components/sonner"

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
    />
  )
}
