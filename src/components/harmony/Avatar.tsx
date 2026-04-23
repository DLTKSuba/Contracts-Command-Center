import {
  forwardRef,
  type ForwardedRef,
  type ReactNode,
} from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Avatar.css'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarVariant = 'icon' | 'initials' | 'image'

const iconSizes: Record<AvatarSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

function normalizeInitials(s?: string): string {
  if (!s?.trim()) return ''
  const parts = s.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  const t = parts[0] ?? ''
  if (t.length <= 2) return t.toUpperCase()
  return t.slice(0, 2).toUpperCase()
}

export interface AvatarProps {
  size?: AvatarSize
  variant?: AvatarVariant
  initials?: string
  src?: string
  alt?: string
  interactive?: boolean
  disabled?: boolean
  className?: string
}

export const Avatar = forwardRef<
  HTMLButtonElement | HTMLDivElement,
  AvatarProps
>(function Avatar(
  {
    size = 'md',
    variant = 'icon',
    initials: initialsProp,
    src,
    alt = '',
    interactive = false,
    disabled = false,
    className = '',
  },
  ref
) {
  const initials = normalizeInitials(initialsProp)

  let contentVariant: AvatarVariant = variant
  if (variant === 'initials' && !initials) contentVariant = 'icon'
  if (variant === 'image' && !src) contentVariant = 'icon'

  const classes = clsx(
    'avatar',
    `avatar--${size}`,
    contentVariant === 'initials' && 'avatar--initials',
    contentVariant === 'image' && 'avatar--image',
    className
  )

  const ariaLabel =
    contentVariant === 'initials'
      ? `Avatar, initials ${initials}`
      : contentVariant === 'image'
        ? alt || 'User avatar photo'
        : 'User avatar'

  const inner: ReactNode = (
    <>
      {contentVariant === 'icon' && (
        <Icon name="user" size={iconSizes[size]} className="avatar__icon" />
      )}
      {contentVariant === 'initials' && (
        <span className="avatar__initials" aria-hidden="true">
          {initials}
        </span>
      )}
      {contentVariant === 'image' && src && (
        <img src={src} alt="" aria-hidden="true" />
      )}
    </>
  )

  if (interactive) {
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        className={classes}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {inner}
      </button>
    )
  }

  return (
    <div
      ref={ref as ForwardedRef<HTMLDivElement>}
      className={classes}
      role="img"
      aria-label={ariaLabel}
    >
      {inner}
    </div>
  )
})
