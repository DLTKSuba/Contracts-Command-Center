import type { ReactNode } from 'react'
import clsx from 'clsx'
import './Tooltip.css'

export interface TooltipProps {
  /** Plain-text tooltip (default Harmony behavior). Ignored when `content` is set. */
  text?: string
  /** Rich tooltip body; takes precedence over `text`. Use for structured layouts. */
  content?: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  cornerVariant?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  children?: ReactNode
}

export function Tooltip({
  text = '',
  content,
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

  const body = content != null ? content : text

  return (
    <div className={classes}>
      {children}
      <div className={contentClasses}>{body}</div>
    </div>
  )
}
