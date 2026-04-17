import { useId, useState, useCallback, useContext, useRef, useLayoutEffect } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { RadioGroupContext } from './RadioGroup'
import './RadioButton.css'

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  value: string
  warning?: boolean
  error?: boolean
  warningMessage?: string
  errorMessage?: string
  className?: string
}

export function RadioButton({
  name,
  id,
  checked: checkedProp,
  defaultChecked = false,
  disabled = false,
  label,
  value,
  warning = false,
  error = false,
  warningMessage,
  errorMessage,
  className = '',
  onChange,
  ...rest
}: RadioButtonProps) {
  const isControlled = checkedProp !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const inputRef = useRef<HTMLInputElement>(null)
  const groupContext = useContext(RadioGroupContext)
  const displayChecked = isControlled ? checkedProp : uncontrolledChecked

  useLayoutEffect(() => {
    if (!isControlled && inputRef.current) {
      setUncontrolledChecked(inputRef.current.checked)
    }
  }, [isControlled, groupContext?.groupVersion ?? 0])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledChecked(e.target.checked)
        groupContext?.notifyChange()
      }
      onChange?.(e)
    },
    [isControlled, onChange, groupContext]
  )

  const generatedId = useId().replace(/:/g, '-')
  const radioId = id || `radio-${generatedId}`
  const messageId =
    error && errorMessage ? `${radioId}-error` : warning && warningMessage ? `${radioId}-warning` : undefined

  const classes = clsx(
    'radio',
    disabled && 'radio--disabled',
    warning && 'radio--warning',
    error && 'radio--error',
    className
  )

  return (
    <div className="radio-wrapper">
      <label className={classes}>
        <input
          ref={inputRef}
          type="radio"
          name={name}
          id={radioId}
          checked={isControlled ? checkedProp : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          value={value}
          className="radio__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          onChange={handleChange}
          {...rest}
        />
        <span
          className={clsx(
            'radio__circle',
            displayChecked ? 'radio__circle--selected' : 'radio__circle--unselected'
          )}
          data-state={displayChecked ? 'checked' : 'unchecked'}
        >
          <span className="radio__dot" />
        </span>
        {label != null && <span className="radio__label">{label}</span>}
      </label>
      {error && errorMessage && (
        <p id={messageId} className="radio-wrapper__error">
          <Icon name="exclamation-circle" size="sm" className="radio-wrapper__error-icon" />
          {errorMessage}
        </p>
      )}
      {!error && warning && warningMessage && (
        <p id={messageId} className="radio-wrapper__warning">
          <Icon name="exclamation-triangle" size="sm" className="radio-wrapper__warning-icon" />
          {warningMessage}
        </p>
      )}
    </div>
  )
}
