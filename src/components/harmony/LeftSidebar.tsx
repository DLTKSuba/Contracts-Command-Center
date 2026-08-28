import clsx from 'clsx'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Icon } from './Icon'
import './LeftSidebar.css'

/* Theme visibility: html.theme-cp .left-sidebar__variant--cp, theme-vp, theme-ppm, theme-maconomy in LeftSidebar.css */

export type LeftSidebarVariant = 'cp' | 'vp' | 'ppm' | 'maconomy'

export interface LeftSidebarNavItem {
  icon?: string
  label: string
  href?: string
  active?: boolean
  isCustom?: boolean
  customSrc?: string
  panelTitle?: string
  panelIcon?: string
  panelContentId?: string
  useGradientHeader?: boolean
}

export interface LeftSidebarSection {
  items: LeftSidebarNavItem[]
}

export interface LeftSidebarItemActivateDetail {
  item: LeftSidebarNavItem
  sectionIndex: number
  itemIndex: number
  itemKey: string
}

const PPM_SECTIONS: LeftSidebarSection[] = [
  {
    items: [
      { icon: 'rectangle-group', label: 'Command Center', active: true },
      { icon: 'book-open', label: 'Programs' },
      { icon: 'briefcase', label: 'Portfolios' },
      { icon: 'building-office', label: 'Projects' },
      { icon: 'Resource', label: 'Resources' },
      { icon: 'Risk Shield', label: 'Risk' },
      { icon: 'Report', label: 'Reports' },
      { icon: 'calendar-days', label: 'Calendars' },
      { icon: 'document', label: 'Codes' },
      { icon: 'wallet', label: 'Rates' },
      { icon: 'cog-6-tooth', label: 'Settings' },
      { icon: 'plus', label: 'Add Menu' },
    ],
  },
]

export interface LeftSidebarProps {
  variant?: LeftSidebarVariant
  sections?: LeftSidebarSection[]
  className?: string
  onItemActivate?: (detail: LeftSidebarItemActivateDetail) => void
}

export function LeftSidebar({
  variant = 'ppm',
  sections,
  className = '',
  onItemActivate,
}: LeftSidebarProps) {
  const sidebarSections = sections ?? PPM_SECTIONS

  const activate = (
    item: LeftSidebarNavItem,
    sectionIndex: number,
    itemIndex: number,
    itemKey: string,
    e: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>
  ) => {
    if (!onItemActivate) return
    e.preventDefault()
    onItemActivate({ item, sectionIndex, itemIndex, itemKey })
  }

  return (
    <nav
      className={clsx('left-sidebar', `left-sidebar--${variant}`, className)}
      data-variant={variant}
    >
      {sidebarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="left-sidebar__section">
          {section.items.map((item, itemIndex) => {
            const panelTitle = item.panelTitle ?? item.label
            const panelIcon = item.panelIcon ?? item.icon
            const itemId = `left-sidebar-item-${sectionIndex}-${itemIndex}`

            return (
              <a
                key={itemId}
                href={item.href ?? '#'}
                className={clsx(
                  'left-sidebar__item',
                  item.active && 'left-sidebar__item--active'
                )}
                data-panel-title={panelTitle}
                data-panel-icon={panelIcon ?? ''}
                data-panel-content-id={item.panelContentId}
                data-item-id={itemId}
                data-active={String(item.active ?? false)}
                data-use-gradient-header={String(item.useGradientHeader ?? false)}
                data-left-sidebar-item
                title={item.label}
                onClick={
                  onItemActivate ? (e) => activate(item, sectionIndex, itemIndex, itemId, e) : undefined
                }
                onKeyDown={
                  onItemActivate
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          activate(item, sectionIndex, itemIndex, itemId, e)
                        }
                      }
                    : undefined
                }
              >
                <span className="left-sidebar__icon">
                  {item.isCustom && item.customSrc ? (
                    <img
                      src={item.customSrc}
                      alt={item.label}
                      className="left-sidebar__custom-icon"
                    />
                  ) : item.icon ? (
                    <Icon name={item.icon} />
                  ) : null}
                </span>
                <span className="left-sidebar__label">{item.label}</span>
              </a>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
