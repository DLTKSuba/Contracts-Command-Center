import clsx from 'clsx'
import { Icon } from './Icon'
import './Avatar.css'

export type AvatarSize = 'sm' | 'md' | 'lg'

const iconSizes: Record<AvatarSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export interface AvatarProps {
  size?: AvatarSize
  className?: string
}

export function Avatar({ size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={clsx('avatar', `avatar--${size}`, className)}
    >
      <Icon name="user" size={iconSizes[size]} className="avatar__icon" />
    </div>
  )
}
