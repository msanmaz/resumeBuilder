// components/ui/textarea.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base",
        "bg-neutral-900 border-neutral-700 text-neutral-200",
        "placeholder:text-neutral-500",
        "focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }