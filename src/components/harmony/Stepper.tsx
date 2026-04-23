import type { ReactNode } from 'react'
import { useId } from 'react'
import clsx from 'clsx'
import { Step } from './Step'
import './Step.css'

export interface StepperProps {
  activeStep?: number
  orientation?: 'horizontal' | 'vertical'
  nonLinear?: boolean
  className?: string
  children?: ReactNode
  steps?: Array<{ label: ReactNode; description?: ReactNode; completed?: boolean; error?: boolean; warning?: boolean; success?: boolean; icon?: string; disabled?: boolean }>
  onStepClick?: (stepIndex: number) => void
}

export function Stepper({
  activeStep = 0,
  orientation = 'horizontal',
  nonLinear = false,
  className = '',
  children,
  steps,
  onStepClick,
}: StepperProps) {
  const generatedId = useId().replace(/:/g, '-')
  const stepperId = `stepper-${generatedId}`

  const classes = clsx(
    'stepper',
    `stepper--${orientation}`,
    nonLinear && 'stepper--non-linear',
    className
  )

  if (children != null) {
    return (
      <div
        className={classes}
        role="group"
        aria-label="Stepper"
        data-stepper
        data-active-step={activeStep}
        data-non-linear={nonLinear}
        id={stepperId}
      >
        {children}
      </div>
    )
  }

  if (steps == null || steps.length === 0) {
    return (
      <div
        className={classes}
        role="group"
        aria-label="Stepper"
        data-stepper
        data-active-step={activeStep}
        data-non-linear={nonLinear}
        id={stepperId}
      />
    )
  }

  return (
    <div
      className={classes}
      role="group"
      aria-label="Stepper"
      data-stepper
      data-active-step={activeStep}
      data-non-linear={nonLinear}
      id={stepperId}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep
        const isCompleted = step.completed ?? index < activeStep
        const isDisabled = step.disabled ?? (!nonLinear && index > activeStep && !isCompleted)
        const connectorActive = index < steps.length - 1 && (isCompleted || index + 1 === activeStep)
        return (
          <Step
            key={index}
            completed={isCompleted}
            disabled={isDisabled}
            error={step.error}
            warning={step.warning}
            success={step.success}
            icon={step.icon}
            label={step.label}
            description={step.description}
            stepNumber={index + 1}
            isActive={isActive}
            connectorActive={connectorActive}
            className={[
              isActive && 'is-active',
              isCompleted && 'is-completed',
              isDisabled && 'is-disabled',
              step.error && 'is-error',
              step.warning && 'is-warning',
              step.success && 'is-success',
            ]
              .filter(Boolean)
              .join(' ')}
            role={nonLinear && !isDisabled ? 'button' : undefined}
            tabIndex={nonLinear && !isDisabled ? 0 : undefined}
            aria-label={nonLinear && !isDisabled ? `Go to step ${index + 1}` : undefined}
            aria-current={isActive ? 'step' : undefined}
            onClick={nonLinear && !isDisabled ? () => onStepClick?.(index) : undefined}
          />
        )
      })}
    </div>
  )
}
