import type { ReactNode } from 'react'
import clsx from 'clsx'
import './ButtonGroup.css'

export type ButtonGroupVariant = 'default' | 'outline'
export type ButtonGroupSize = 'sm' | 'md' | 'lg'
export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps {
  variant?: ButtonGroupVariant
  size?: ButtonGroupSize
  orientation?: ButtonGroupOrientation
  className?: string
  children: ReactNode
}

export function ButtonGroup({
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className = '',
  children,
}: ButtonGroupProps) {
  return (
    <div
      className={clsx(
        'btn-group',
        `btn-group--${variant}`,
        `btn-group--${size}`,
        `btn-group--${orientation}`,
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}
