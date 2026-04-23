import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Chip.css'

export type ChipSize = 'sm' | 'md' | 'lg'
export type ChipVariant = 'fill' | 'outline'
export type ChipState =
  | 'enabled'
  | 'disabled'
  | 'hover'
  | 'focused'
  | 'pressed'
export type ChipType = 'chip' | 'horiz-dots' | 'vert-dots' | 'overflow'

export interface ChipProps {
  size?: ChipSize
  variant?: ChipVariant
  state?: ChipState
  type?: ChipType
  overflowCount?: number
  selected?: boolean
  removable?: boolean
  onRemove?: () => void
  icon?: string
  /** Default text when no children are provided. Default "Chip". */
  label?: string
  className?: string
  children?: ReactNode
}

const iconSizeMap: Record<ChipSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export function Chip({
  size = 'md',
  variant = 'fill',
  state = 'enabled',
  type = 'chip',
  overflowCount,
  selected = false,
  removable = false,
  onRemove,
  icon,
  label = 'Chip',
  className = '',
  children,
}: ChipProps) {
  const iconSize = iconSizeMap[size]
  const classes = clsx(
    'chip',
    `chip--${size}`,
    `chip--${variant}`,
    `chip--${state}`,
    type !== 'chip' && `chip--${type}`,
    selected && 'chip--selected',
    className
  )

  return (
    <span className={classes}>
      {type === 'horiz-dots' ? (
        <span className="chip__dots chip__dots--horiz" aria-label="More options">
          <svg
            viewBox="0 0 18 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="chip__dots-svg"
          >
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            <circle cx="9" cy="2" r="1.5" fill="currentColor" />
            <circle cx="16" cy="2" r="1.5" fill="currentColor" />
          </svg>
        </span>
      ) : type === 'vert-dots' ? (
        <span className="chip__dots chip__dots--vert" aria-label="More options">
          <svg
            viewBox="0 0 4 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="chip__dots-svg"
          >
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            <circle cx="2" cy="9" r="1.5" fill="currentColor" />
            <circle cx="2" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </span>
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize} />}
          {type === 'overflow' ? (
            <span className="chip__overflow-text">
              +{overflowCount ?? 10}
            </span>
          ) : (
            children ?? label
          )}
          {removable && (
            <button
              type="button"
              className="chip__remove"
              aria-label="Remove"
              onClick={(e) => {
                e.stopPropagation()
                onRemove?.()
              }}
            >
              <Icon name="x-mark" size={iconSize} />
            </button>
          )}
        </>
      )}
    </span>
  )
}
