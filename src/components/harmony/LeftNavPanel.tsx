import { useEffect } from 'react'
import { Icon } from './Icon'
import './LeftNavPanel.css'

export interface LeftNavPanelItem {
  label: string
  /** Renders the +/- expander affordance on the trailing edge. */
  expandable?: boolean
}

export interface LeftNavPanelProps {
  title?: string
  items?: LeftNavPanelItem[]
  onItemSelect?: (item: LeftNavPanelItem) => void
}

const DEFAULT_ITEMS: LeftNavPanelItem[] = [{ label: 'Configure Settings' }]

/**
 * Expanded navigation flyout that sits beside the left rail and floats over
 * the page content. Locks the rail at its collapsed width so it cannot
 * hover-expand underneath this panel.
 *
 * `data-rail-locked` rather than `data-panel-open`: the latter also flattens
 * the rail's section cards for panels that sit flush against the rail, and
 * this flyout sits alongside them.
 */
export function LeftNavPanel({
  title = 'Command Center',
  items = DEFAULT_ITEMS,
  onItemSelect,
}: LeftNavPanelProps) {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>('.shell-layout__left-sidebar')
    if (rail == null) return
    rail.setAttribute('data-rail-locked', 'true')
    return () => rail.removeAttribute('data-rail-locked')
  }, [])

  return (
    <nav className="left-nav-panel" aria-label={`${title} menu`}>
      <h2 className="left-nav-panel__title">{title}</h2>
      <ul className="left-nav-panel__list">
        {items.map((item) => (
          <li key={item.label} className="left-nav-panel__row">
            <button
              type="button"
              className="left-nav-panel__item"
              onClick={onItemSelect ? () => onItemSelect(item) : undefined}
            >
              <span className="left-nav-panel__label">{item.label}</span>
              {item.expandable === true && (
                <Icon name="plus" size="sm" className="left-nav-panel__expander" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
