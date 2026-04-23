import { useId } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Label } from './Label'
import './Input.css'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'search' | 'tel'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType
  placeholder?: string
  value?: string
  name?: string
  id?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  icon?: string
  /** Heroicon name; ignored when `trailing` is set */
  trailingIcon?: string
  /** Right-side content (e.g. password toggle, clear); takes precedence over `trailingIcon` */
  trailing?: ReactNode
  required?: boolean
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  className?: string
}

export function Input({
  type = 'text',
  placeholder,
  value,
  name,
  id,
  disabled = false,
  error = false,
  errorMessage,
  icon,
  trailingIcon,
  trailing,
  required = false,
  label,
  labelVariant,
  labelFor,
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId().replace(/:/g, '-')
  const inputId = id || `input-${generatedId}`

  const hasTrailing = trailing != null || Boolean(trailingIcon)

  const inputClasses = clsx(
    'input',
    icon && 'input--with-icon',
    hasTrailing && 'input--with-trailing',
    error && 'input--error',
    className
  )

  const wrapperClasses = clsx(
    'input-form-wrapper',
    label && labelVariant && `input-form-wrapper--${labelVariant}`
  )

  const trailingEl =
    trailing != null ? (
      <div className="input-wrapper__trailing">{trailing}</div>
    ) : trailingIcon ? (
      <Icon name={trailingIcon} size="sm" className="input-wrapper__icon input-wrapper__icon--trailing" />
    ) : null

  const inputEl = (
    <>
      {icon && <Icon name={icon} size="sm" className="input-wrapper__icon" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        id={inputId}
        disabled={disabled}
        required={required}
        className={inputClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
        {...rest}
      />
      {trailingEl}
      {error && errorMessage && (
        <p id={`${inputId}-error`} className="input-wrapper__error">
          {errorMessage}
        </p>
      )}
    </>
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? inputId}
          className={labelVariant === 'inline' || !labelVariant ? 'input-form-wrapper__label' : ''}
        >
          {label}
        </Label>
        <div className="input-wrapper">{inputEl}</div>
      </div>
    )
  }

  return <div className="input-wrapper">{inputEl}</div>
}
