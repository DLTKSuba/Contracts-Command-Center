import type { ReactNode } from 'react'
import clsx from 'clsx'
import './Tooltip.css'

export interface TooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  cornerVariant?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  children?: ReactNode
}

export function Tooltip({
  text,
  position = 'top',
  cornerVariant,
  className = '',
  children,
}: TooltipProps) {
  const contentClasses = clsx(
    'tooltip__content',
    position === 'bottom' && 'tooltip__content--bottom',
    position === 'left' && 'tooltip__content--left',
    position === 'right' && 'tooltip__content--right',
    cornerVariant === 'top' && 'tooltip__content--corner-top',
    cornerVariant === 'bottom' && 'tooltip__content--corner-bottom',
    cornerVariant === 'left' && 'tooltip__content--corner-left',
    cornerVariant === 'right' && 'tooltip__content--corner-right'
  )

  const classes = clsx('tooltip', className)

  return (
    <span className={classes}>
      {children}
      <span className={contentClasses}>{text}</span>
    </span>
  )
}
