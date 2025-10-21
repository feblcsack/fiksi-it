"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>

export function Toast({ className, ...props }: ToastProps) {
  return (
    <ToastPrimitives.Root
      className={cn(
        "bg-background border text-foreground shadow-md rounded-md p-4 flex items-start space-x-3 w-full max-w-sm",
        className
      )}
      {...props}
    />
  )
}

export const ToastActionElement = ToastPrimitives.Action

export function ToastClose() {
  return (
    <ToastPrimitives.Close asChild>
      <button className="ml-auto text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </ToastPrimitives.Close>
  )
}
