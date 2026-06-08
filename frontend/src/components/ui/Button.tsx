import { ButtonHTMLAttributes, ReactNode } from "react"
import { clsx } from "clsx"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // variants
          "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm":
            variant === "primary",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400":
            variant === "secondary",
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm":
            variant === "outline",
          "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400":
            variant === "ghost",
          // sizes
          "px-3 py-1.5 text-sm gap-1.5": size === "sm",
          "px-4 py-2.5 text-sm gap-2": size === "md",
          "px-6 py-3 text-base gap-2": size === "lg",
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
