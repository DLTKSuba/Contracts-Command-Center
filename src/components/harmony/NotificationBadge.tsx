import clsx from 'clsx'
import './NotificationBadge.css'

export interface NotificationBadgeProps {
  type?: 'dot' | 'number' | 'overflow'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'error' | 'primary'
  value?: string | number
  border?: boolean
  className?: string
}

export function NotificationBadge({
  type = 'number',
  size = 'md',
  variant = 'primary',
  value = 1,
  border = false,
  className = '',
}: NotificationBadgeProps) {
  const classes = clsx(
    'notification-badge',
    `notification-badge--${type}`,
    `notification-badge--${size}`,
    `notification-badge--${variant}`,
    border && 'notification-badge--border',
    className
  )
  const displayValue = type === 'dot' ? '' : String(value)

  if (type === 'dot') {
    return <span className={classes} aria-label="Notification indicator" />
  }
  return (
    <span className={classes} aria-label={`${displayValue} notifications`}>
      {displayValue}
    </span>
  )
}
