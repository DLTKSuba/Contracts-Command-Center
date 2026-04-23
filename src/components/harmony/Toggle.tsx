import { useCallback, useId, useState } from 'react'
import clsx from 'clsx'
import './Toggle.css'

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name?: string
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  variant?: 'default' | 'segmented'
  optionLabelLeft?: string
  optionLabelRight?: string
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
  variant = 'default',
  optionLabelLeft = 'Item 1',
  optionLabelRight = 'Item 2',
  size = 'md',
  className = '',
  onChange,
  'aria-label': ariaLabelProp,
  ...rest
}: ToggleProps) {
  const generatedId = useId().replace(/:/g, '-')
  const toggleId = id || `toggle-${generatedId}`

  const isControlled = checked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false)
  const mergedChecked = isControlled ? checked! : uncontrolledChecked

  const isSegmented = variant === 'segmented'
  const defaultSegmentedAriaLabel = `${optionLabelLeft}, ${optionLabelRight}`
  const ariaLabel = ariaLabelProp ?? (isSegmented ? defaultSegmentedAriaLabel : undefined)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolledChecked(e.target.checked)
      onChange?.(e)
    },
    [isControlled, onChange]
  )

  const classes = clsx(
    'toggle',
    isSegmented && 'toggle--segmented',
    size === 'sm' && 'toggle--sm',
    disabled && 'toggle--disabled',
    className
  )

  return (
    <label className={classes}>
      <input
        type="checkbox"
        role="switch"
        name={name}
        id={toggleId}
        disabled={disabled}
        className="toggle__input"
        aria-checked={mergedChecked}
        aria-label={ariaLabel}
        onChange={handleChange}
        {...rest}
        {...(isControlled ? { checked } : { defaultChecked: defaultChecked ?? false })}
      />
      {isSegmented ? (
        <span className="toggle__track toggle__track--segmented">
          <span className="toggle__thumb toggle__thumb--segmented" aria-hidden />
          <span className="toggle__segment toggle__segment--left">{optionLabelLeft}</span>
          <span className="toggle__segment toggle__segment--right">{optionLabelRight}</span>
        </span>
      ) : (
        <>
          <span className="toggle__track">
            <span className="toggle__thumb" />
          </span>
          {label != null && <span className="toggle__label">{label}</span>}
        </>
      )}
    </label>
  )
}
