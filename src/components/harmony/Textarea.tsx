import { useId } from 'react'
import clsx from 'clsx'
import { Label } from './Label'
import './Textarea.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  value?: string
  name?: string
  id?: string
  disabled?: boolean
  rows?: number
  required?: boolean
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  className?: string
}

export function Textarea({
  placeholder,
  value,
  name,
  id,
  disabled = false,
  rows = 4,
  required = false,
  label,
  labelVariant,
  labelFor,
  className = '',
  ...rest
}: TextareaProps) {
  const generatedId = useId().replace(/:/g, '-')
  const textareaId = id || `textarea-${generatedId}`

  const wrapperClasses = clsx(
    'textarea-form-wrapper',
    label && labelVariant && `textarea-form-wrapper--${labelVariant}`
  )
  const inputClasses = clsx('textarea', className)

  const textareaEl = (
    <textarea
      placeholder={placeholder}
      name={name}
      id={textareaId}
      disabled={disabled}
      rows={rows}
      required={required}
      className={inputClasses}
      value={value}
      {...rest}
    />
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? textareaId}
          className={labelVariant === 'inline' || !labelVariant ? 'textarea-form-wrapper__label' : ''}
        >
          {label}
        </Label>
        {textareaEl}
      </div>
    )
  }

  return textareaEl
}
