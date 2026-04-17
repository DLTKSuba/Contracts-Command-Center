import { useId, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Label } from './Label'
import './NumberInput.css'

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  name?: string
  id?: string
  disabled?: boolean
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  className?: string
  onChange?: (value: number) => void
}

export function NumberInput({
  value = 0,
  min,
  max,
  step = 1,
  name,
  id,
  disabled = false,
  label,
  labelVariant,
  labelFor,
  className = '',
  onChange,
  ...rest
}: NumberInputProps) {
  const generatedId = useId().replace(/:/g, '-')
  const numberInputId = id || `number-input-${generatedId}`

  const wrapperClasses = clsx(
    'number-input-form-wrapper',
    label && labelVariant && `number-input-form-wrapper--${labelVariant}`
  )
  const inputWrapperClasses = clsx('number-input', className)

  const clamp = useCallback(
    (v: number) => {
      let n = v
      if (min !== undefined && n < min) n = min
      if (max !== undefined && n > max) n = max
      return n
    },
    [min, max]
  )

  const handleDecrement = useCallback(() => {
    const newVal = clamp(value - step)
    if (newVal !== value) onChange?.(newVal)
  }, [value, step, clamp, onChange])

  const handleIncrement = useCallback(() => {
    const newVal = clamp(value + step)
    if (newVal !== value) onChange?.(newVal)
  }, [value, step, clamp, onChange])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value)
      if (!Number.isNaN(parsed)) onChange?.(clamp(parsed))
    },
    [clamp, onChange]
  )

  const atMin = min !== undefined && value <= min
  const atMax = max !== undefined && value >= max

  const control = (
    <div className={inputWrapperClasses} data-number-input>
      <button
        type="button"
        className="number-input__btn"
        data-number-input-decrement
        disabled={disabled || atMin}
        aria-label="Decrease"
        onClick={handleDecrement}
      >
        <Icon name="minus" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        name={name}
        id={numberInputId}
        disabled={disabled}
        className="number-input__input"
        onChange={handleInputChange}
        {...rest}
      />
      <button
        type="button"
        className="number-input__btn"
        data-number-input-increment
        disabled={disabled || atMax}
        aria-label="Increase"
        onClick={handleIncrement}
      >
        <Icon name="plus" />
      </button>
    </div>
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? numberInputId}
          className={labelVariant === 'inline' || !labelVariant ? 'number-input-form-wrapper__label' : ''}
        >
          {label}
        </Label>
        {control}
      </div>
    )
  }

  return control
}
