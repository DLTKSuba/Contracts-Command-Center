import type { ReactNode } from 'react'
import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './CheckboxGroup.css'

export interface CheckboxGroupProps {
  legend?: string
  error?: boolean
  warning?: boolean
  errorMessage?: string
  warningMessage?: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
  children: ReactNode
}

export function CheckboxGroup({
  legend,
  error = false,
  warning = false,
  errorMessage,
  warningMessage,
  orientation = 'vertical',
  className = '',
  children,
}: CheckboxGroupProps) {
  const groupId = useId().replace(/:/g, '-')
  const messageId =
    error && errorMessage
      ? `${groupId}-error`
      : warning && warningMessage
        ? `${groupId}-warning`
        : undefined

  return (
    <fieldset
      className={clsx(
        'checkbox-group-wrapper',
        error && 'checkbox-group-wrapper--error',
        warning && 'checkbox-group-wrapper--warning',
        orientation === 'horizontal' && 'checkbox-group-wrapper--horizontal',
        className
      )}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={messageId}
    >
      {legend && (
        <legend
          className={clsx(
            'checkbox-group-wrapper__legend',
            error && 'checkbox-group-wrapper__legend--error',
            warning && 'checkbox-group-wrapper__legend--warning'
          )}
        >
          {legend}
        </legend>
      )}
      <div className="checkbox-group-wrapper__content">{children}</div>
      {error && errorMessage && (
        <p
          id={messageId}
          className="checkbox-group-wrapper__message checkbox-group-wrapper__message--error"
        >
          <Icon
            name="exclamation-circle"
            size="sm"
            className="checkbox-group-wrapper__message-icon"
          />
          {errorMessage}
        </p>
      )}
      {!error && warning && warningMessage && (
        <p
          id={messageId}
          className="checkbox-group-wrapper__message checkbox-group-wrapper__message--warning"
        >
          <Icon
            name="exclamation-triangle"
            size="sm"
            className="checkbox-group-wrapper__message-icon"
          />
          {warningMessage}
        </p>
      )}
    </fieldset>
  )
}
