import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Badge.css'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'orange'
  | 'pink'
  | 'disabled'

export interface BadgeProps {
  variant?: BadgeVariant
  icon?: string
  className?: string
  children: ReactNode
}

export function Badge({
  variant = 'default',
  icon,
  className = '',
  children,
}: BadgeProps) {
  return (
    <span className={clsx('badge', `badge--${variant}`, className)}>
      {icon && <Icon name={icon} size="xs" />}
      {children}
    </span>
  )
}
