import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive' | 'dela' | 'dela-pill'
  buttonType?: 'theme' | 'pageHeader'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  icon?: string
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  href?: string
  onClick?: () => void
  children?: ReactNode
  className?: string
  ariaLabel?: string
}

const iconSizeMap = {
  xs: 'xs' as const,
  sm: 'sm' as const,
  md: 'sm' as const,
  lg: 'md' as const,
}

export function Button({
  variant = 'primary',
  buttonType = 'theme',
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  type = 'button',
  fullWidth = false,
  href,
  onClick,
  children,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const iconSize = iconSizeMap[size]
  const hasChildren = children != null && (typeof children === 'string' ? children.trim() !== '' : true)
  const isIconOnly = Boolean(icon && !hasChildren && !loading)
  const isDelaVariant = variant === 'dela' || variant === 'dela-pill'

  const classes = clsx(
    'btn',
    `btn--${variant}`,
    buttonType === 'pageHeader' && !isDelaVariant && 'btn--page-header',
    isIconOnly ? `btn--icon-${size}` : `btn--${size}`,
    orientation === 'vertical' && 'btn--vertical',
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    fullWidth && 'btn--full',
    className
  )

  const spinner = (
    <>
      <svg className="btn__spinner" width="var(--btn-spinner-size)" height="var(--btn-spinner-size)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" style={{ strokeWidth: 'var(--btn-spinner-stroke-width)' }} />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {loadingText && <span>{loadingText}</span>}
    </>
  )

  const content = loading ? (
    spinner
  ) : (
    <>
      {isDelaVariant && <img src="/Stars.svg" alt="" className="btn__dela-stars" />}
      {icon && iconPosition === 'left' && <Icon name={icon} size={iconSize} />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} size={iconSize} />}
    </>
  )

  const effectiveDisabled = disabled || loading

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-busy={loading ? 'true' : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={effectiveDisabled}
      aria-busy={loading ? 'true' : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
