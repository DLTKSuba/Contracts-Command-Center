import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

export interface CardProps {
  elevated?: boolean
  interactive?: boolean
  primary?: boolean
  withHeader?: boolean
  headerTitle?: string
  headerSubtitle?: string
  icon1?: string
  icon2?: string
  icon3?: string
  className?: string
  header?: ReactNode
  headerActions?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

export function Card({
  elevated = false,
  interactive = false,
  primary = false,
  withHeader = false,
  headerTitle = '',
  headerSubtitle = '',
  icon1,
  icon2,
  icon3,
  className = '',
  header,
  headerActions,
  children,
  footer,
}: CardProps) {
  const hasIconActions = !!(icon1 || icon2 || icon3)

  const classes = clsx(
    'card',
    elevated && 'card--elevated',
    interactive && 'card--interactive',
    primary && 'card--primary',
    (withHeader || header != null) && 'card--with-header',
    className
  )

  const hasHeader = withHeader || header != null
  const hasFooter = footer != null

  return (
    <div className={classes}>
      {hasHeader && (
        <div className="card__header">
          {header != null ? (
            header
          ) : withHeader ? (
            <div className="card__header-content">
              {headerTitle && (
                <h2 className="card__header-title">{headerTitle}</h2>
              )}
              {headerSubtitle && (
                <p className="card__header-subtitle">{headerSubtitle}</p>
              )}
            </div>
          ) : null}
          {(headerActions != null || hasIconActions) && (
            <div className="card__header-actions">
              {headerActions != null ? (
                headerActions
              ) : (
                <>
                  {icon3 && (
                    <button className="card__icon-btn" type="button" aria-label="Settings">
                      <Icon name={icon3} size="sm" />
                    </button>
                  )}
                  {icon2 && (
                    <button className="card__icon-btn" type="button" aria-label="More options">
                      <Icon name={icon2} size="sm" />
                    </button>
                  )}
                  {icon1 && (
                    <button className="card__icon-btn" type="button" aria-label="Close">
                      <Icon name={icon1} size="sm" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
      <div className="card__body">
        {children ?? (
          <p className="card__body-default">
            Card body content. Override by passing default slot content.
          </p>
        )}
      </div>
      {hasFooter && <div className="card__footer">{footer}</div>}
    </div>
  )
}
