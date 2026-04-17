import { useId } from 'react'
import clsx from 'clsx'
import './Toggle.css'

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name?: string
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  size?: 'sm' | 'md'
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Toggle({
  name,
  id,
  checked,
  defaultChecked,
  disabled = false,
  label,
  size = 'md',
  className = '',
  onChange,
  ...rest
}: ToggleProps) {
  const generatedId = useId().replace(/:/g, '-')
  const toggleId = id || `toggle-${generatedId}`

  const isControlled = checked !== undefined

  const classes = clsx(
    'toggle',
    size === 'sm' && 'toggle--sm',
    disabled && 'toggle--disabled',
    className
  )

  return (
    <label className={classes}>
      <input
        type="checkbox"
        name={name}
        id={toggleId}
        disabled={disabled}
        className="toggle__input"
        onChange={onChange}
        {...rest}
        {...(isControlled ? { checked } : { defaultChecked: defaultChecked ?? false })}
      />
      <span className="toggle__track">
        <span className="toggle__thumb" />
      </span>
      {label != null && <span className="toggle__label">{label}</span>}
    </label>
  )
}
