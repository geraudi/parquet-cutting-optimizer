/**
 * Toast notification system for user feedback
 */

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

// Global toast state management
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];
let toastIdCounter = 0;

/**
 * Subscribe to toast updates
 */
export function subscribeToToasts(listener: (toasts: Toast[]) => void): () => void {
  toastListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
}

/**
 * Notify all listeners of toast updates
 */
function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]));
}

/**
 * Add a new toast notification
 */
function addToast(type: ToastType, options: ToastOptions): string {
  const id = `toast-${++toastIdCounter}`;
  const toast: Toast = {
    id,
    type,
    title: options.title,
    message: options.message,
    duration: options.duration ?? (type === "error" ? 8000 : 5000),
    dismissible: options.dismissible ?? true,
  };
  
  toasts.push(toast);
  notifyListeners();
  
  // Auto-dismiss after duration
  if (toast.duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, toast.duration);
  }
  
  return id;
}

/**
 * Dismiss a toast by ID
 */
export function dismissToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
}

/**
 * Clear all toasts
 */
export function clearAllToasts() {
  toasts = [];
  notifyListeners();
}

/**
 * Show success toast
 */
export function showSuccessToast(options: ToastOptions): string {
  return addToast("success", options);
}

/**
 * Show error toast
 */
export function showErrorToast(options: ToastOptions): string {
  return addToast("error", options);
}

/**
 * Show warning toast
 */
export function showWarningToast(options: ToastOptions): string {
  return addToast("warning", options);
}

/**
 * Show info toast
 */
export function showInfoToast(options: ToastOptions): string {
  return addToast("info", options);
}

/**
 * Get current toasts
 */
export function getCurrentToasts(): Toast[] {
  return [...toasts];
}