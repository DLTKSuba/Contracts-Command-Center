import type { ReactNode } from 'react'
import { createContext, useId, useState, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './RadioGroup.css'

export const RadioGroupContext = createContext<{ groupVersion: number; notifyChange: () => void } | null>(null)

export interface RadioGroupProps {
  name: string
  legend?: string
  error?: boolean
  warning?: boolean
  errorMessage?: string
  warningMessage?: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
  children?: ReactNode
}

export function RadioGroup({
  name: _name,
  legend,
  error = false,
  warning = false,
  errorMessage,
  warningMessage,
  orientation = 'vertical',
  className = '',
  children,
}: RadioGroupProps) {
  const [groupVersion, setGroupVersion] = useState(0)
  const notifyChange = useCallback(() => setGroupVersion((v) => v + 1), [])

  const generatedId = useId().replace(/:/g, '-')
  const groupId = `radio-group-${generatedId}`
  const messageId =
    error && errorMessage ? `${groupId}-error` : warning && warningMessage ? `${groupId}-warning` : undefined

  const wrapperClasses = clsx(
    'radio-group-wrapper',
    error && 'radio-group-wrapper--error',
    warning && 'radio-group-wrapper--warning',
    orientation === 'horizontal' && 'radio-group-wrapper--horizontal',
    className
  )

  const legendClasses = clsx(
    'radio-group-wrapper__legend',
    error && 'radio-group-wrapper__legend--error',
    warning && 'radio-group-wrapper__legend--warning'
  )

  return (
    <RadioGroupContext.Provider value={{ groupVersion, notifyChange }}>
      <fieldset
        className={wrapperClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
      >
        {legend != null && <legend className={legendClasses}>{legend}</legend>}
        <div className="radio-group-wrapper__content">{children}</div>
      {error && errorMessage && (
        <p id={messageId} className="radio-group-wrapper__message radio-group-wrapper__message--error">
          <Icon name="exclamation-circle" size="sm" className="radio-group-wrapper__message-icon" />
          {errorMessage}
        </p>
      )}
      {!error && warning && warningMessage && (
        <p id={messageId} className="radio-group-wrapper__message radio-group-wrapper__message--warning">
          <Icon name="exclamation-triangle" size="sm" className="radio-group-wrapper__message-icon" />
          {warningMessage}
        </p>
      )}
      </fieldset>
    </RadioGroupContext.Provider>
  )
}
