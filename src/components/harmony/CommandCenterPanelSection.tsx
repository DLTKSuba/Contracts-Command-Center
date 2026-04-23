import { useId, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Table.css'

export interface CommandCenterPanelSectionProps {
  title: string
  defaultOpen?: boolean
  className?: string
  children?: ReactNode
}

/**
 * One independent collapsible block inside `CommandCenterPanel` (not a single accordion: sections toggle separately).
 */
export function CommandCenterPanelSection({
  title,
  defaultOpen = true,
  className,
  children,
}: CommandCenterPanelSectionProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const regionId = `${id}-cc-panel-region`
  const btnId = `${id}-cc-panel-btn`

  return (
    <div
      className={clsx('command-center-panel-section', open && 'command-center-panel-section--open', className)}
      data-command-center-section
    >
      <button
        type="button"
        id={btnId}
        className="command-center-panel-section__trigger"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => { setOpen((o) => !o) }}
      >
        <Icon name="chevron-down" className="command-center-panel-section__chevron" size="sm" />
        <span className="command-center-panel-section__title">{title}</span>
      </button>
      <div
        className="command-center-panel-section__content"
        id={regionId}
        role="region"
        aria-labelledby={btnId}
      >
        <div className="command-center-panel-section__inner">
          {children}
        </div>
      </div>
    </div>
  )
}
