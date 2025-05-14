"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps, toast as sonnerToast } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          title: "group-[.toast]:text-foreground group-[.toast]:font-medium",
          description: "group-[.toast]:text-foreground group-[.toast]:text-sm group-[.toast]:opacity-90", // Changed to text-foreground and added opacity
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground",
          success:
            "group-[.toaster]:!bg-background group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-emerald-500 group-[.toaster]:before:content-[''] group-[.toaster]:before:absolute group-[.toaster]:before:left-2 group-[.toaster]:before:top-2 group-[.toaster]:before:h-6 group-[.toaster]:before:w-6 group-[.toaster]:before:rounded-full group-[.toaster]:before:bg-emerald-500/15",
          error:
            "group-[.toaster]:!bg-background group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-red-500 group-[.toaster]:before:content-[''] group-[.toaster]:before:absolute group-[.toaster]:before:left-2 group-[.toaster]:before:top-2 group-[.toaster]:before:h-6 group-[.toaster]:before:w-6 group-[.toaster]:before:rounded-full group-[.toaster]:before:bg-red-500/15",
          warning:
            "group-[.toaster]:!bg-background group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-amber-500 group-[.toaster]:before:content-[''] group-[.toaster]:before:absolute group-[.toaster]:before:left-2 group-[.toaster]:before:top-2 group-[.toaster]:before:h-6 group-[.toaster]:before:w-6 group-[.toaster]:before:rounded-full group-[.toaster]:before:bg-amber-500/15",
          info: "group-[.toaster]:!bg-background group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-blue-500 group-[.toaster]:before:content-[''] group-[.toaster]:before:absolute group-[.toaster]:before:left-2 group-[.toaster]:before:top-2 group-[.toaster]:before:h-6 group-[.toaster]:before:w-6 group-[.toaster]:before:rounded-full group-[.toaster]:before:bg-blue-500/15",
          loading:
            "group-[.toaster]:!bg-background group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-blue-500/30",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

// Fungsi toast yang ditingkatkan dengan default yang lebih baik
const toast = {
  ...sonnerToast,
  success: (message: string, options?: any) =>
    sonnerToast.success(message, {
      duration: 4000,
      className: "toast-success",
      ...options,
    }),
  error: (message: string, options?: any) =>
    sonnerToast.error(message, {
      duration: 5000,
      className: "toast-error",
      ...options,
    }),
  warning: (message: string, options?: any) =>
    sonnerToast.warning(message, {
      duration: 4500,
      className: "toast-warning",
      ...options,
    }),
  info: (message: string, options?: any) =>
    sonnerToast.info(message, {
      duration: 3500,
      className: "toast-info",
      ...options,
    }),
}

export { Toaster, toast }