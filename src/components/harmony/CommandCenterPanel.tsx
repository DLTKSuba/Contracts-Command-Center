import React, { type ReactNode, useId } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Table.css'

export interface CommandCenterPanelProps {
  title: string
  open?: boolean
  onClose?: () => void
  className?: string
  closeButtonLabel?: string
  children?: ReactNode
  /** Top area: charts, links, KPIs (optional). */
  visual?: ReactNode
}

export function CommandCenterPanel({
  title,
  open = true,
  onClose,
  className = '',
  closeButtonLabel = 'Close panel',
  children,
  visual,
}: CommandCenterPanelProps): React.ReactElement | null {
  const titleId = useId()
  if (!open) {
    return null
  }

  return (
    <aside className={clsx('command-center-panel', className)} aria-labelledby={titleId}>
      <div className="command-center-panel__header">
        <h2 className="command-center-panel__title" id={titleId}>
          {title}
        </h2>
        <button
          type="button"
          className="command-center-panel__close"
          aria-label={closeButtonLabel}
          onClick={onClose}
        >
          <Icon name="x-mark" size="md" />
        </button>
      </div>
      <div className="command-center-panel__body">
        {visual != null && <div className="command-center-panel__visual">{visual}</div>}
        {children}
      </div>
    </aside>
  )
}
