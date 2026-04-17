import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './PickerPopup.css'

export interface PickerPopupProps {
  id: string
  triggerId?: string
  className?: string
  title?: string
  /** Controlled open state; when true, popup has class is-open */
  open?: boolean
  /** Called when user closes (Escape, outside click, or close button) */
  onClose?: () => void
  children?: ReactNode
}

export function PickerPopup({
  id,
  triggerId = '',
  className = '',
  title,
  open = false,
  onClose,
  children,
}: PickerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !onClose) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClickOutside = (e: MouseEvent) => {
      const path = e.composedPath()
      const popup = popupRef.current
      if (!popup || path.includes(popup)) return
      const wrapper = triggerId
        ? document.getElementById(triggerId)?.closest('.date-input-wrapper')
        : null
      if (wrapper && path.includes(wrapper)) return
      onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open, onClose, triggerId])

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }

  return (
    <div
      ref={popupRef}
      className={clsx('picker-popup', open && 'is-open', className)}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id}-title` : undefined}
      data-picker-popup
      data-trigger-id={triggerId}
    >
      {title && (
        <div className="picker-popup__header">
          <h3 className="picker-popup__title" id={`${id}-title`}>
            {title}
          </h3>
          <button
            type="button"
            className="picker-popup__close"
            data-picker-close
            aria-label="Close picker"
            onClick={handleCloseClick}
          >
            <Icon name="x-mark" size="sm" />
          </button>
        </div>
      )}
      <div className="picker-popup__body">
        {children ?? (
          <p className="picker-popup__body-default">
            Picker content. Override by passing default slot content.
          </p>
        )}
      </div>
    </div>
  )
}
