"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type" | "ref"> {
  showStrength?: boolean
  ref?: React.Ref<HTMLInputElement>
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-destructive" }
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" }
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" }
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" }
  return { score: 5, label: "Very Strong", color: "bg-emerald-600" }
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [strength, setStrength] = React.useState({ score: 0, label: "", color: "" })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrength) {
      const value = e.target.value
      if (value) {
        setStrength(getPasswordStrength(value))
      } else {
        setStrength({ score: 0, label: "", color: "" })
      }
    }
    props.onChange?.(e)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      {showStrength && strength.score > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  level <= strength.score ? strength.color : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className={cn(
            "text-xs transition-colors",
            strength.score <= 1 ? "text-destructive" :
            strength.score <= 2 ? "text-orange-500" :
            strength.score <= 3 ? "text-yellow-600 dark:text-yellow-500" :
            "text-emerald-600 dark:text-emerald-500"
          )}>
            {strength.label}
          </p>
        </div>
      )}
    </div>
  )
})

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
