/**
 * Toast notification system using Sonner
 */

import { toast } from "sonner"

export interface ToastOptions {
  title: string
  message?: string
  duration?: number
}

/**
 * Show success toast
 */
export function showSuccessToast(options: ToastOptions): string | number {
  return toast.success(options.title, {
    description: options.message,
    duration: options.duration ?? 5000,
  })
}

/**
 * Show error toast
 */
export function showErrorToast(options: ToastOptions): string | number {
  return toast.error(options.title, {
    description: options.message,
    duration: options.duration ?? 8000,
  })
}

/**
 * Show warning toast
 */
export function showWarningToast(options: ToastOptions): string | number {
  return toast.warning(options.title, {
    description: options.message,
    duration: options.duration ?? 6000,
  })
}

/**
 * Show info toast
 */
export function showInfoToast(options: ToastOptions): string | number {
  return toast.info(options.title, {
    description: options.message,
    duration: options.duration ?? 5000,
  })
}

/**
 * Dismiss a toast by ID
 */
export function dismissToast(id: string | number) {
  toast.dismiss(id)
}

/**
 * Clear all toasts
 */
export function clearAllToasts() {
  toast.dismiss()
}
