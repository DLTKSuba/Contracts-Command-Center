import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import './Alert.css'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'
export type AlertStyle = 'default' | 'enhanced'

export interface AlertButtonConfig {
  text: string
  href?: string
  onClick?: () => void
}

export interface AlertProps {
  variant?: AlertVariant
  style?: AlertStyle
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: string
  primaryButton?: AlertButtonConfig
  secondaryButton?: AlertButtonConfig
  linkText?: string
  linkHref?: string
  progressValue?: number
  className?: string
  children: ReactNode
}

const defaultIcons: Record<AlertVariant, string> = {
  info: 'information-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
}

export function Alert({
  variant = 'info',
  style = 'default',
  title,
  dismissible = false,
  onDismiss,
  icon,
  primaryButton,
  secondaryButton,
  linkText,
  linkHref,
  progressValue,
  className = '',
  children,
}: AlertProps) {
  const alertIcon = icon ?? defaultIcons[variant]
  const hasActions = primaryButton || secondaryButton || (linkText && linkHref)

  const classes = clsx(
    'alert',
    `alert--${variant}`,
    style === 'enhanced' && 'alert--enhanced',
    className
  )

  const renderActions = () => {
    if (!hasActions || style !== 'enhanced') return null
    return (
      <div className="alert__actions">
        {(primaryButton || secondaryButton) && (
          <div className="alert__buttons">
            {primaryButton && (
              primaryButton.href ? (
                <Button buttonType="theme" variant="primary" size="xs" href={primaryButton.href}>
                  {primaryButton.text}
                </Button>
              ) : (
                <Button
                  buttonType="theme"
                  variant="primary"
                  size="xs"
                  onClick={primaryButton.onClick}
                >
                  {primaryButton.text}
                </Button>
              )
            )}
            {secondaryButton && (
              secondaryButton.href ? (
                <Button buttonType="theme" variant="secondary" size="xs" href={secondaryButton.href}>
                  {secondaryButton.text}
                </Button>
              ) : (
                <Button
                  buttonType="theme"
                  variant="secondary"
                  size="xs"
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.text}
                </Button>
              )
            )}
          </div>
        )}
        {linkText && linkHref && (
          <a href={linkHref} className="alert__link">
            {linkText}
          </a>
        )}
      </div>
    )
  }

  const iconEl = <Icon name={alertIcon} className="alert__icon" />
  const closeButton = dismissible ? (
    <button
      type="button"
      className="alert__close"
      aria-label="Dismiss"
      onClick={onDismiss}
    >
      <Icon name="x-mark" />
    </button>
  ) : null

  return (
    <div className={classes} role="alert">
      {style === 'enhanced' && <div className="alert__border" />}
      {style === 'enhanced' ? (
        <div className="alert__content">
          <div className="alert__inner">
            {iconEl}
            <div className="alert__text">
              {title && <div className="alert__title">{title}</div>}
              <div className="alert__message">{children}</div>
            </div>
            {closeButton}
          </div>
          {renderActions()}
          {progressValue !== undefined && (
            <div className="alert__progress">
              <ProgressBar
                value={progressValue}
                size="sm"
                variant={variant === 'info' ? 'info' : variant}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {iconEl}
          <div className="alert__content">
            {title && <div className="alert__title">{title}</div>}
            <div className="alert__message">{children}</div>
          </div>
          {closeButton}
        </>
      )}
    </div>
  )
}
