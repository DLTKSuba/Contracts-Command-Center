import clsx from 'clsx'
import { Icon } from './Icon'
import './RightSidebar.css'

/* Theme visibility: html.theme-cp .right-sidebar__variant--cp, theme-vp, theme-ppm, theme-maconomy in RightSidebar.css */

export type RightSidebarVariant = 'cp' | 'vp' | 'ppm' | 'maconomy'

export interface RightSidebarNavItem {
  icon?: string
  label: string
  href?: string
  isCustom?: boolean
  customSrc?: string
  customSrcActive?: string
  panelTitle?: string
  panelIcon?: string
  panelContentId?: string
  useGradientHeader?: boolean
}

export interface RightSidebarSection {
  items: RightSidebarNavItem[]
}

const CP_SECTIONS: RightSidebarSection[] = [
  {
    items: [
      {
        label: 'Dela AI',
        isCustom: true,
        customSrc: '/RS_DelaDefault.svg',
        customSrcActive: '/RS_Dela_Active.svg',
      },
      { icon: 'bell', label: 'Notifications' },
      { icon: 'arrow-up-tray', label: 'Files' },
    ],
  },
  {
    items: [
      { icon: 'printer', label: 'Print' },
      { icon: 'view-columns', label: 'Layout Options' },
    ],
  },
  {
    items: [
      { icon: 'mic-slash', label: 'Microphone' },
      { icon: 'signal-slash', label: 'Offline' },
      { icon: 'command-line', label: 'Keyboard Shortcuts' },
      { icon: 'question-mark-circle', label: 'Help' },
    ],
  },
]

const PPM_SECTIONS: RightSidebarSection[] = [
  {
    items: [
      {
        label: 'Dela AI',
        isCustom: true,
        customSrc: '/RS_DelaDefault.svg',
        customSrcActive: '/RS_Dela_Active.svg',
      },
      { icon: 'pencil-square', label: 'Edit' },
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
      { icon: 'related', label: 'Related' },
      { icon: 'template', label: 'Templates' },
      { icon: 'cloud-arrow-up', label: 'Upload' },
      { icon: 'cloud-arrow-down', label: 'Download' },
    ],
  },
  {
    items: [
      { icon: 'bell', label: 'Notifications' },
      { icon: 'question-mark-circle', label: 'Help' },
      { icon: 'share', label: 'Share' },
    ],
  },
  {
    items: [
      { icon: 'globe-alt', label: 'Accessibility' },
      { icon: 'language', label: 'Language' },
      { icon: 'moon', label: 'Dark Mode' },
    ],
  },
]

const VP_SECTIONS: RightSidebarSection[] = PPM_SECTIONS

const MACONOMY_SECTIONS: RightSidebarSection[] = PPM_SECTIONS

const SECTIONS_BY_VARIANT: Record<RightSidebarVariant, RightSidebarSection[]> = {
  cp: CP_SECTIONS,
  vp: VP_SECTIONS,
  ppm: PPM_SECTIONS,
  maconomy: MACONOMY_SECTIONS,
}

function getSections(variant: RightSidebarVariant, sections?: RightSidebarSection[]): RightSidebarSection[] {
  if (sections) return sections
  return SECTIONS_BY_VARIANT[variant] ?? PPM_SECTIONS
}

export interface RightSidebarProps {
  variant?: RightSidebarVariant
  sections?: RightSidebarSection[]
  className?: string
}

export function RightSidebar({
  variant = 'ppm',
  sections,
  className = '',
}: RightSidebarProps) {
  const sidebarSections = getSections(variant, sections)

  return (
    <nav
      className={clsx('right-sidebar', `right-sidebar--${variant}`, className)}
      data-variant={variant}
    >
      {sidebarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="right-sidebar__section">
          {section.items.map((item, itemIndex) => {
            const panelTitle = item.panelTitle ?? item.label
            const panelIcon = item.panelIcon ?? item.icon
            const itemId = `right-sidebar-item-${sectionIndex}-${itemIndex}`

            return (
              <a
                key={itemId}
                href={item.href ?? '#'}
                className="right-sidebar__item"
                data-panel-title={panelTitle}
                data-panel-icon={panelIcon ?? ''}
                data-panel-content-id={item.panelContentId}
                data-item-id={itemId}
                data-use-gradient-header={String(item.useGradientHeader ?? false)}
                data-right-sidebar-item
                title={item.label}
              >
                <span className="right-sidebar__label">{item.label}</span>
                <span className="right-sidebar__icon">
                  {item.isCustom && item.customSrc ? (
                    item.customSrcActive ? (
                      <>
                        <img
                          src={item.customSrc}
                          alt={item.label}
                          className="right-sidebar__dela-logo right-sidebar__dela-logo--default"
                        />
                        <img
                          src={item.customSrcActive}
                          alt={item.label}
                          className="right-sidebar__dela-logo right-sidebar__dela-logo--active"
                        />
                      </>
                    ) : (
                      <img
                        src={item.customSrc}
                        alt={item.label}
                        className="right-sidebar__dela-logo"
                      />
                    )
                  ) : item.icon ? (
                    <Icon name={item.icon} />
                  ) : null}
                </span>
              </a>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
