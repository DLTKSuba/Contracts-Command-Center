import { useId } from 'react'
import clsx from 'clsx'
import { Label } from './Label'
import './RangeInput.css'

export interface RangeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  name?: string
  id?: string
  disabled?: boolean
  showPercent?: boolean
  prefix?: string
  suffix?: string
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  className?: string
  onChange?: (value: number) => void
}

export function RangeInput({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  name,
  id,
  disabled = false,
  showPercent = false,
  prefix = '',
  suffix = '',
  label,
  labelVariant,
  labelFor,
  className = '',
  onChange,
  ...rest
}: RangeInputProps) {
  const generatedId = useId().replace(/:/g, '-')
  const rangeId = id || `range-${generatedId}`

  const displayValue = showPercent
    ? `${prefix}${Math.round(((value - min) / (max - min)) * 100)}%${suffix}`
    : `${prefix}${value}${suffix}`

  const wrapperClasses = clsx(
    'range-input-form-wrapper',
    label && labelVariant && `range-input-form-wrapper--${labelVariant}`
  )
  const wrapClasses = clsx('range-wrap', className)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (!Number.isNaN(v)) onChange?.(v)
  }

  const control = (
    <div className={wrapClasses}>
      <input
        type="range"
        id={rangeId}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="range"
        data-show-percent={showPercent ? 'true' : undefined}
        data-prefix={prefix || undefined}
        data-suffix={suffix || undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className="range-value" data-for={rangeId}>
        {displayValue}
      </span>
    </div>
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? rangeId}
          className={labelVariant === 'inline' || !labelVariant ? 'range-input-form-wrapper__label' : ''}
        >
          {label}
        </Label>
        {control}
      </div>
    )
  }

  return control
}
