import type { ReactNode } from 'react'
import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Step.css'

export interface StepProps {
  completed?: boolean
  disabled?: boolean
  error?: boolean
  warning?: boolean
  success?: boolean
  icon?: string
  className?: string
  label?: ReactNode
  description?: ReactNode
  stepNumber?: number
  isActive?: boolean
  connectorActive?: boolean
  onClick?: () => void
  role?: string
  tabIndex?: number
  'aria-label'?: string
  'aria-current'?: 'step' | 'false'
}

export function Step({
  completed = false,
  disabled = false,
  error = false,
  warning = false,
  success = false,
  icon,
  className = '',
  label = 'Step label',
  description,
  stepNumber = 1,
  isActive = false,
  connectorActive = false,
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
}: StepProps) {
  const generatedId = useId().replace(/:/g, '-')
  const stepId = `step-${generatedId}`

  const classes = clsx(
    'step',
    completed && 'step--completed',
    disabled && 'step--disabled',
    error && 'step--error',
    warning && 'step--warning',
    success && 'step--success',
    isActive && 'is-active',
    completed && 'is-completed',
    disabled && 'is-disabled',
    error && 'is-error',
    warning && 'is-warning',
    success && 'is-success',
    className
  )

  return (
    <div
      className={classes}
      data-step
      data-completed={completed}
      data-disabled={disabled}
      data-error={error}
      data-warning={warning}
      data-success={success}
      id={stepId}
      role={role ?? 'group'}
      aria-label={ariaLabel ?? `Step ${stepId}`}
      aria-current={ariaCurrent}
      tabIndex={tabIndex}
      onClick={onClick}
    >
      <div className="step__indicator" aria-hidden="true">
        {icon ? (
          <Icon name={icon} size="sm" className="step__icon" />
        ) : (
          <span className="step__number">{stepNumber}</span>
        )}
        {error && !icon && <Icon name="exclamation-circle" size="sm" className="step__error-icon" />}
        {warning && !error && !icon && <Icon name="exclamation-triangle" size="sm" className="step__warning-icon" />}
        {success && !error && !warning && !icon && <Icon name="check" size="sm" className="step__success-icon" />}
        {completed && !error && !warning && !success && !icon && <Icon name="check" size="sm" className="step__check" />}
      </div>
      <div className={`step__connector ${connectorActive ? 'is-active' : ''}`} aria-hidden="true" />
      <div className="step__label">
        <span className="step__label-text">{label}</span>
        {description != null && <span className="step__description">{description}</span>}
      </div>
    </div>
  )
}
