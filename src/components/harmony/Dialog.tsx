import type { ReactNode } from 'react'
import { useEffect } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Button } from './Button'
import './Dialog.css'

export interface DialogProps {
  id: string
  title: string
  open?: boolean
  onClose?: () => void
  className?: string
  buttonAlignment?: 'left' | 'right'
  headerVariant?: 'default' | 'primary'
  children?: ReactNode
  footer?: ReactNode
}

export function Dialog({
  id,
  title,
  open = false,
  onClose,
  className = '',
  buttonAlignment = 'left',
  headerVariant = 'default',
  children,
  footer,
}: DialogProps) {
  const overlayId = `${id}-overlay`
  const titleId = `${id}-title`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div
      id={overlayId}
      className={clsx('dialog-overlay', open && 'is-open')}
      data-dialog-overlay
      onClick={handleOverlayClick}
    >
      <div
        className={clsx('dialog', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={clsx(
            'dialog__header',
            `dialog__header--variant-${headerVariant}`
          )}
        >
          <h2 className="dialog__title" id={titleId}>
            {title}
          </h2>
          <button
            type="button"
            className="dialog__close"
            data-dialog-close
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x-mark" />
          </button>
        </div>
        <div className="dialog__body">
          {children ?? (
            <p className="dialog__body-default">
              Dialog content. Override by passing default slot content.
            </p>
          )}
        </div>
        <div
          className={clsx(
            'dialog__footer',
            `dialog__footer--align-${buttonAlignment}`
          )}
        >
          {footer ?? (
            <div>
              <Button buttonType="theme" variant="primary" onClick={onClose}>
                Confirm
              </Button>
              <Button buttonType="theme" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
