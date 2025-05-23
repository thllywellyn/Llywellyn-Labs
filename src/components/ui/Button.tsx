import { ButtonHTMLAttributes, FC } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-orange-600 text-white hover:bg-orange-700',
        outline: 'bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50',
        ghost: 'bg-transparent hover:bg-orange-50 text-orange-600',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
