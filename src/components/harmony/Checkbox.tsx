import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Checkbox.css'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name?: string
  id?: string
  checked?: boolean
  disabled?: boolean
  label?: string
  value?: string
  warning?: boolean
  error?: boolean
  warningMessage?: string
  errorMessage?: string
  className?: string
}

export function Checkbox({
  name,
  id,
  checked,
  disabled = false,
  label,
  value,
  warning = false,
  error = false,
  warningMessage,
  errorMessage,
  className = '',
  ...rest
}: CheckboxProps) {
  const checkboxId = useId().replace(/:/g, '-')
  const resolvedId = id || checkboxId
  const messageId =
    error && errorMessage
      ? `${resolvedId}-error`
      : warning && warningMessage
        ? `${resolvedId}-warning`
        : undefined

  const isControlled = checked !== undefined
  const { 'aria-invalid': _ariaInvalid, ...restWithoutAriaInvalid } = rest
  const inputProps = {
    name,
    id: resolvedId,
    disabled,
    value,
    className: 'checkbox__input',
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': messageId,
    ...restWithoutAriaInvalid,
    ...(isControlled ? { checked } : {}),
  }

  return (
    <div className="checkbox-wrapper">
      <label
        className={clsx(
          'checkbox',
          disabled && 'checkbox--disabled',
          warning && 'checkbox--warning',
          error && 'checkbox--error',
          className
        )}
      >
        <input type="checkbox" {...inputProps} />
        <span className="checkbox__box">
          <Icon name="check" className="checkbox__icon" />
        </span>
        {label && <span className="checkbox__label">{label}</span>}
      </label>
      {error && errorMessage && (
        <p id={messageId} className="checkbox-wrapper__error">
          <Icon
            name="exclamation-circle"
            size="sm"
            className="checkbox-wrapper__error-icon"
          />
          {errorMessage}
        </p>
      )}
      {!error && warning && warningMessage && (
        <p id={messageId} className="checkbox-wrapper__warning">
          <Icon
            name="exclamation-triangle"
            size="sm"
            className="checkbox-wrapper__warning-icon"
          />
          {warningMessage}
        </p>
      )}
    </div>
  )
}
