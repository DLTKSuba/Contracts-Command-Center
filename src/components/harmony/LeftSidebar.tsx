import clsx from 'clsx'
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

const CP_SECTIONS: LeftSidebarSection[] = [
  {
    items: [
      { icon: 'home', label: 'Welcome screen' },
      { icon: 'squares-2x2', label: 'Dashboard' },
      { icon: 'star', label: 'My menu' },
      { icon: 'clock', label: 'Recent' },
    ],
  },
  {
    items: [
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'squares-plus', label: 'Command Center' },
      { icon: 'calculator', label: 'Accounting' },
      { icon: 'chart-bar', label: 'Planning' },
      { icon: 'document-arrow-down', label: 'Capture & contracts' },
      { icon: 'clipboard-document-list', label: 'Projects' },
      { icon: 'cube', label: 'Materials' },
      { icon: 'clock', label: 'Time & expense' },
      { icon: 'users', label: 'People' },
      { icon: 'document-chart-bar', label: 'Reports' },
      { icon: 'cog-6-tooth', label: 'Admin' },
    ],
  },
]

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

const VP_SECTIONS: LeftSidebarSection[] = PPM_SECTIONS

const MACONOMY_SECTIONS: LeftSidebarSection[] = PPM_SECTIONS

const SECTIONS_BY_VARIANT: Record<LeftSidebarVariant, LeftSidebarSection[]> = {
  cp: CP_SECTIONS,
  vp: VP_SECTIONS,
  ppm: PPM_SECTIONS,
  maconomy: MACONOMY_SECTIONS,
}

function getSections(variant: LeftSidebarVariant, sections?: LeftSidebarSection[]): LeftSidebarSection[] {
  if (sections) return sections
  return SECTIONS_BY_VARIANT[variant] ?? PPM_SECTIONS
}

export interface LeftSidebarProps {
  variant?: LeftSidebarVariant
  sections?: LeftSidebarSection[]
  className?: string
}

export function LeftSidebar({
  variant = 'ppm',
  sections,
  className = '',
}: LeftSidebarProps) {
  const sidebarSections = getSections(variant, sections)

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
                data-use-gradient-header={String(item.useGradientHeader ?? false)}
                data-left-sidebar-item
                title={item.label}
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
