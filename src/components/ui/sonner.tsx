"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-5" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1.5rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast frosted gap-3! p-4! shadow-[0_12px_32px_rgba(0,0,0,0.14)]!",
          title: "text-sm! font-bold!",
          description: "text-[13px]! text-muted-foreground!",
          error: "border-destructive! [&_[data-icon]]:text-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
