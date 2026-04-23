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

export type BadgeSize = 'small' | 'medium' | 'large'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: string
  className?: string
  children: ReactNode
}

const iconSizeMap: Record<BadgeSize, 'xs' | 'sm'> = {
  small: 'xs',
  medium: 'xs',
  large: 'sm',
}

export function Badge({
  variant = 'default',
  size = 'large',
  icon,
  className = '',
  children,
}: BadgeProps) {
  const iconSize = icon ? iconSizeMap[size] : undefined
  return (
    <span className={clsx('badge', `badge--${variant}`, `badge--${size}`, className)}>
      {icon && iconSize && <Icon name={icon} size={iconSize} />}
      {children}
    </span>
  )
}
