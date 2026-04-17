import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './ShellPanel.css'

export interface ShellPanelProps {
  side: 'left' | 'right'
  open: boolean
  title: string
  titleIcon?: string
  headerVariant?: 'theme' | 'default'
  width?: 'narrow' | 'full'
  showClose?: boolean
  showPopout?: boolean
  variant?: 'default' | 'dela'
  id?: string
  className?: string
  onClose?: () => void
  onWidthToggle?: (width: 'narrow' | 'full') => void
  header?: ReactNode
  children?: ReactNode
}

export function ShellPanel({
  side,
  open,
  title,
  titleIcon,
  headerVariant = 'theme',
  width: controlledWidth,
  showClose = true,
  showPopout = true,
  variant = 'default',
  id,
  className = '',
  onClose,
  onWidthToggle,
  header,
  children,
}: ShellPanelProps) {
  const [internalWidth, setInternalWidth] = useState<'narrow' | 'full'>('narrow')
  const width = controlledWidth ?? internalWidth

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleToggleWidth = useCallback(() => {
    const next = width === 'full' ? 'narrow' : 'full'
    if (controlledWidth == null) setInternalWidth(next)
    onWidthToggle?.(next)
  }, [width, controlledWidth, onWidthToggle])

  const panelClasses = clsx(
    'shell-panel',
    `shell-panel--${side}`,
    `shell-panel--${width}`,
    open && 'shell-panel--open',
    className
  )

  const headerClasses = clsx('shell-panel__header', `shell-panel__header--${headerVariant}`)

  return (
    <div
      id={id}
      className={panelClasses}
      data-side={side}
      data-open={open}
      data-width={width}
      data-dela-panel={variant === 'dela' ? 'true' : undefined}
    >
      {header != null ? (
        header
      ) : (
        <div className={headerClasses} data-header-variant={headerVariant}>
          <div className="shell-panel__header-content">
            <span className="shell-panel__header-icon" data-panel-icon-container>
              {titleIcon != null && (
                <Icon name={titleIcon} size="md" data-panel-icon={titleIcon} />
              )}
            </span>
            <h2 className="shell-panel__title">{title}</h2>
            <div className="shell-panel__actions">
              <button
                type="button"
                className="shell-panel__action shell-panel__action--toggle-width"
                aria-label="Toggle panel width"
                data-panel-toggle-width
                onClick={handleToggleWidth}
              >
                <Icon name="arrows-pointing-out" size="md" variant="outline" className="shell-panel__icon-maximize" />
                <Icon name="arrows-pointing-in" size="md" variant="outline" className="shell-panel__icon-minimize" />
              </button>
              {showPopout && (
                <button
                  type="button"
                  className="shell-panel__action shell-panel__action--popout"
                  aria-label="Pop out panel"
                  data-panel-popout
                >
                  <Icon name="arrow-top-right-on-square" size="md" />
                </button>
              )}
              {showClose && (
                <button
                  type="button"
                  className="shell-panel__action shell-panel__action--close"
                  aria-label="Close panel"
                  data-panel-close
                  onClick={handleClose}
                >
                  <Icon name="x-mark" size="lg" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="shell-panel__content">
        {children ?? (
          <p className="shell-panel__content-default">Panel content. Override by passing default slot content.</p>
        )}
      </div>
    </div>
  )
}
