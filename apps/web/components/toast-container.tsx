"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Toast, subscribeToToasts, dismissToast } from "@web/lib/toast";

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts);
    return unsubscribe;
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "error":
        return "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 flex-shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 flex-shrink-0" />;
      default:
        return <Info className="h-5 w-5 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg flex items-start gap-3 shadow-lg border transition-all animate-in slide-in-from-right-full",
        getToastStyles(toast.type)
      )}
    >
      {getIcon(toast.type)}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{toast.title}</div>
        {toast.message && (
          <div className="text-sm mt-1 opacity-90">{toast.message}</div>
        )}
      </div>
      {toast.dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dismissToast(toast.id)}
          className="h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-full flex-shrink-0"
          title="Fermer la notification"
        >
          <span className="sr-only">Fermer la notification</span>
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}