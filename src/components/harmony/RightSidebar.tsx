import clsx from 'clsx'
import { forwardRef } from 'react'
import type { KeyboardEvent, MouseEvent, RefObject } from 'react'
import { Icon } from './Icon'
import type { RightSidebarItemActivateDetail } from './useRightSidebarPanel'
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

export interface RightSidebarProps {
  variant?: RightSidebarVariant
  sections?: RightSidebarSection[]
  className?: string
  /** Optional refs for documentation / composition parity with Astro (panel wiring uses useRightSidebarPanel with the same refs). */
  rightPanelRef?: RefObject<HTMLElement | null>
  shellPanelScopeRef?: RefObject<HTMLElement | null>
  /** Mirrors data-panel-open when wired to a shell panel */
  panelOpen?: boolean
  activeItemKey?: string | null
  onItemActivate?: (detail: RightSidebarItemActivateDetail) => void
}

export const RightSidebar = forwardRef<HTMLElement, RightSidebarProps>(function RightSidebar(
  {
    variant = 'ppm',
    sections,
    className = '',
    panelOpen,
    activeItemKey = null,
    onItemActivate,
    rightPanelRef: _rightPanelRef,
    shellPanelScopeRef: _shellPanelScopeRef,
  },
  ref
) {
  const sidebarSections = sections ?? PPM_SECTIONS

  const activate = (
    item: RightSidebarNavItem,
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
      ref={ref}
      className={clsx('right-sidebar', `right-sidebar--${variant}`, className)}
      data-variant={variant}
      data-panel-open={panelOpen ? 'true' : undefined}
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
                data-active={activeItemKey === itemId ? 'true' : undefined}
                title={item.label}
                role={onItemActivate ? 'button' : undefined}
                onClick={onItemActivate ? (e) => activate(item, sectionIndex, itemIndex, itemId, e) : undefined}
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
})
