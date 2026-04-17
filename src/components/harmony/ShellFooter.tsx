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
  className?: string
}

export function ShellFooter({
  tabs = [],
  showMore = false,
  moreCount: _moreCount = 0,
  overflowTabs = [],
  showAddTab = true,
  variant = 'default',
  className = '',
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
        className="shell-footer__tabstrip"
      />
    </div>
  )
}
