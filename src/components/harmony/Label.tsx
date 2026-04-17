import type { ReactNode } from 'react'
import clsx from 'clsx'
import './Label.css'

export interface LabelProps {
  htmlFor?: string
  required?: boolean
  helper?: string
  className?: string
  children: ReactNode
}

export function Label({
  htmlFor,
  required = false,
  helper,
  className = '',
  children,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('label', required && 'label--required', className)}
    >
      {children}
      {helper && (
        <span className="label__helper"> ({helper})</span>
      )}
    </label>
  )
}
