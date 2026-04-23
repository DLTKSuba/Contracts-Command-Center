import clsx from 'clsx'
import { TabStrip, type TabStripTab } from './TabStrip'
import './ShellFooter.css'

export type ShellFooterTab = TabStripTab

export interface ShellFooterProps {
  tabs?: ShellFooterTab[]
  showMore?: boolean
  moreCount?: number
  overflowTabs?: ShellFooterTab[]
  showAddTab?: boolean
  variant?: 'default' | 'compact'
  showTabOpenInNew?: boolean
  showTabClose?: boolean
  showTabOverflowMenu?: boolean
  className?: string
  onTabSelected?: (tabId: string) => void
  onAddTab?: () => void
  onCloseTab?: (tabId: string) => void
  onOpenNewWindow?: (tabId: string) => void
  onSetDefault?: (tabId: string) => void
}

export function ShellFooter({
  tabs = [],
  showMore = false,
  moreCount: _moreCount = 0,
  overflowTabs = [],
  showAddTab = true,
  variant = 'default',
  showTabOpenInNew = false,
  showTabClose = false,
  showTabOverflowMenu = false,
  className = '',
  onTabSelected,
  onAddTab,
  onCloseTab,
  onOpenNewWindow,
  onSetDefault,
}: ShellFooterProps) {
  const overflowMode =
    showMore && overflowTabs.length > 0 ? 'manual' : 'none'
  const tabsWithPinIcon = tabs.map((tab) => ({
    ...tab,
    icon: tab.active ? 'pin' : tab.icon ?? undefined,
    iconPosition: tab.active
      ? 'left'
      : (tab.iconPosition ?? (tab.icon ? 'left' : undefined)),
  }))
  const overflowTabsWithPinIcon = overflowTabs.map((tab) => ({
    ...tab,
    icon: tab.active ? 'pin' : tab.icon ?? undefined,
    iconPosition: tab.active
      ? 'left'
      : (tab.iconPosition ?? (tab.icon ? 'left' : undefined)),
  }))

  return (
    <div
      className={clsx(
        'shell-footer',
        variant === 'compact' && 'shell-footer--compact',
        className
      )}
      data-variant={variant}
    >
      <TabStrip
        tabs={tabsWithPinIcon}
        showAddTab={showAddTab}
        overflowMode={overflowMode}
        overflowTabs={overflowTabsWithPinIcon}
        variant={variant}
        showTabOpenInNew={showTabOpenInNew}
        showTabClose={showTabClose}
        showTabOverflowMenu={showTabOverflowMenu}
        onTabSelected={onTabSelected}
        onAddTab={onAddTab}
        onCloseTab={onCloseTab}
        onOpenNewWindow={onOpenNewWindow}
        onSetDefault={onSetDefault}
        className="shell-footer__tabstrip"
      />
    </div>
  )
}
