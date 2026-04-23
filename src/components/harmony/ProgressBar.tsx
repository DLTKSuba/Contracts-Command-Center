import clsx from 'clsx'
import './ProgressBar.css'

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type ProgressBarSize = 'sm' | 'md' | 'lg'

export interface ProgressBarProps {
  value: number
  max?: number
  size?: ProgressBarSize
  variant?: ProgressBarVariant
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const variantClass = variant !== 'default' && variant !== 'info' ? `progress--${variant}` : ''

  return (
    <>
      <div
        className={clsx(
          'progress',
          size !== 'md' && `progress--${size}`,
          variantClass,
          className
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="progress__bar" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <span className="text-sm text-secondary mt-1">{Math.round(percentage)}%</span>
      )}
    </>
  )
}
