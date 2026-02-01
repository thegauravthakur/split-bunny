import * as React from "react"
import { IconType } from "react-icons"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: IconType
  selectAllOnFocus?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon: StartIcon, selectAllOnFocus, onFocus, ...props }, ref) => {
    // Only create handler if needed - avoids serialization issues in Server Components
    const handleFocus = (selectAllOnFocus || onFocus)
      ? (e: React.FocusEvent<HTMLInputElement>) => {
          if (selectAllOnFocus) {
            e.target.select()
          }
          onFocus?.(e)
        }
      : undefined

    if (StartIcon) {
      return (
        <div className="relative">
          <StartIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            {...(handleFocus && { onFocus: handleFocus })}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...(handleFocus && { onFocus: handleFocus })}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
