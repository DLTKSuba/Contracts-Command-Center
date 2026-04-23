import clsx from 'clsx'
import './Spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const classes = clsx('spinner', size !== 'md' && `spinner--${size}`, className)

  return (
    <div className={classes} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
