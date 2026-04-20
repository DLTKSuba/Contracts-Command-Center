import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './TabStrip.css'

export interface TabStripTab {
  id: string
  label: string
  icon?: string
  iconPosition?: 'left' | 'right' | 'top'
  active?: boolean
  disabled?: boolean
  href?: string
  /** When true (and `onTabClose` is provided), a close control is shown for this tab (button tabs only). */
  closable?: boolean
}

export interface TabStripProps {
  tabs: TabStripTab[]
  /** When set with `onTabChange`, selection is controlled by this id instead of each tab’s `active` flag. */
  activeTabId?: string
  onTabChange?: (tabId: string) => void
  /** Called when a tab with `closable: true` is dismissed. */
  onTabClose?: (tabId: string) => void
  showAddTab?: boolean
  addTabLabel?: string
  overflowMode?: 'auto' | 'manual' | 'none'
  overflowTabs?: TabStripTab[]
  variant?: 'default' | 'compact'
  iconPosition?: 'left' | 'right' | 'top'
  className?: string
}

export function TabStrip({
  tabs = [],
  activeTabId,
  onTabChange,
  onTabClose,
  showAddTab = false,
  addTabLabel = 'Add Tab',
  overflowMode = 'auto',
  overflowTabs = [],
  variant = 'default',
  iconPosition: componentIconPosition,
  className = '',
}: TabStripProps) {
  const componentId = useId().replace(/:/g, '')
  const iconPosition = componentIconPosition ?? 'left'

  return (
    <div
      className={clsx(
        'tabstrip',
        variant === 'compact' && 'tabstrip--compact',
        className
      )}
      data-tabstrip
      data-variant={variant}
      data-overflow-mode={overflowMode}
      id={componentId}
    >
      <nav role="tablist" aria-label="Tabs" className="tabstrip__nav">
        <div className="tabstrip__container">
          <div className="tabstrip__tabs" data-tabstrip-tabs>
            {tabs.map((tab) => {
              const controlled = onTabChange != null
              const isActive = controlled ? activeTabId === tab.id : !!tab.active
              const iconModifier =
                iconPosition === 'top'
                  ? 'tab--icon-top'
                  : iconPosition === 'right'
                    ? 'tab--icon-right'
                    : 'tab--icon-left'
              const tabContent = (
                <>
                  {tab.icon && iconPosition === 'top' && (
                    <span className="tab__icon-wrapper">
                      <Icon name={tab.icon} size="sm" className="tab__icon" />
                    </span>
                  )}
                  {tab.icon &&
                    (iconPosition === 'left' || iconPosition === 'top') &&
                    iconPosition !== 'top' && (
                      <Icon name={tab.icon} size="sm" className="tab__icon" />
                    )}
                  <span className="tab__label">{tab.label}</span>
                  {tab.icon && iconPosition === 'right' && (
                    <Icon name={tab.icon} size="sm" className="tab__icon" />
                  )}
                </>
              )
              const tabClasses = clsx(
                'tab',
                isActive && 'is-active',
                tab.disabled && 'tab--disabled',
                iconModifier
              )
              const tabIndex = isActive && !tab.disabled ? 0 : -1
              const select = () => {
                if (!tab.disabled) onTabChange?.(tab.id)
              }

              if (tab.href) {
                return (
                  <a
                    key={tab.id}
                    href={tab.href}
                    role="tab"
                    aria-selected={isActive ? 'true' : 'false'}
                    aria-disabled={tab.disabled ? 'true' : 'false'}
                    className={tabClasses}
                    tabIndex={tabIndex}
                    data-tab-id={tab.id}
                    data-tab-icon={tab.icon ?? ''}
                  >
                    {tabContent}
                  </a>
                )
              }

              const closable = Boolean(tab.closable && onTabClose)
              if (closable) {
                return (
                  <div
                    key={tab.id}
                    className={clsx('tabstrip__tab-group', isActive && 'is-active')}
                    data-tab-id={tab.id}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive ? 'true' : 'false'}
                      aria-disabled={tab.disabled ? 'true' : 'false'}
                      className={clsx(
                        'tab',
                        'tab--in-group',
                        tab.disabled && 'tab--disabled',
                        iconModifier,
                      )}
                      disabled={tab.disabled}
                      tabIndex={tabIndex}
                      data-tab-icon={tab.icon ?? ''}
                      onClick={select}
                    >
                      {tabContent}
                    </button>
                    <button
                      type="button"
                      className="tabstrip__tab-close"
                      aria-label={`Close ${tab.label}`}
                      title="Close tab"
                      onClick={(e) => {
                        e.preventDefault()
                        onTabClose?.(tab.id)
                      }}
                    >
                      <Icon name="x-mark" size="xs" />
                    </button>
                  </div>
                )
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive ? 'true' : 'false'}
                  aria-disabled={tab.disabled ? 'true' : 'false'}
                  className={tabClasses}
                  disabled={tab.disabled}
                  tabIndex={tabIndex}
                  data-tab-id={tab.id}
                  data-tab-icon={tab.icon ?? ''}
                  onClick={select}
                >
                  {tabContent}
                </button>
              )
            })}
          </div>

          {showAddTab && (
            <button
              type="button"
              className="tab tabstrip__add"
              aria-label={addTabLabel}
              data-tabstrip-add
            >
              <Icon name="plus" size="sm" />
              <span>{addTabLabel}</span>
            </button>
          )}

          {overflowMode !== 'none' && (
            <div
              className="tabstrip__more-wrapper"
              data-tabstrip-more
              style={{ display: 'none' }}
            >
              <button
                type="button"
                className="tab tabstrip__more"
                aria-label="Show more tabs"
                aria-haspopup="true"
                aria-expanded="false"
                data-tabstrip-more-btn
              >
                <span data-tabstrip-more-label>More (0)</span>
                <Icon name="ellipsis-horizontal-circle" size="sm" />
              </button>
              <div
                className="tabstrip__dropdown"
                role="menu"
                aria-label="Overflow tabs menu"
                data-tabstrip-dropdown
              >
                <div
                  className="tabstrip__dropdown-section"
                  data-tabstrip-dropdown-items
                >
                  {overflowTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={clsx(
                        'tabstrip__dropdown-item',
                        tab.active && 'is-active'
                      )}
                      role="menuitem"
                    >
                      <button
                        type="button"
                        className="tabstrip__dropdown-item-label"
                        data-tab-id={tab.id}
                        data-action="select-tab"
                      >
                        {tab.icon && (
                          <Icon
                            name={tab.icon}
                            size="sm"
                            className="tabstrip__dropdown-item-icon"
                          />
                        )}
                        <span>{tab.label}</span>
                      </button>
                      <div className="tabstrip__dropdown-item-actions">
                        <button
                          type="button"
                          className="tabstrip__dropdown-action-btn"
                          data-tab-id={tab.id}
                          data-action="open-new-window"
                          aria-label={`Open ${tab.label} in new window`}
                          title="Open in new window"
                        >
                          <Icon name="arrow-top-right-on-square" size="sm" />
                        </button>
                        <button
                          type="button"
                          className="tabstrip__dropdown-action-btn"
                          data-tab-id={tab.id}
                          data-action="close-tab"
                          aria-label={`Close ${tab.label}`}
                          title="Close"
                        >
                          <Icon name="x-mark" size="sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
