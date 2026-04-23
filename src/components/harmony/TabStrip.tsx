import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  showOpenInNewWindow?: boolean
  showClose?: boolean
  showMenu?: boolean
}

export interface TabStripProps {
  tabs: TabStripTab[]
  showAddTab?: boolean
  addTabLabel?: string
  overflowMode?: 'auto' | 'manual' | 'none'
  overflowTabs?: TabStripTab[]
  variant?: 'default' | 'compact' | 'pill'
  iconPosition?: 'left' | 'right' | 'top'
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

function tabEffectiveFlags(
  tab: TabStripTab,
  showTabOpenInNew: boolean,
  showTabClose: boolean,
  showTabOverflowMenu: boolean
) {
  const effOpen =
    tab.showOpenInNewWindow !== undefined
      ? tab.showOpenInNewWindow
      : showTabOpenInNew
  const effClose =
    tab.showClose !== undefined ? tab.showClose : showTabClose
  const effMenu =
    tab.showMenu !== undefined ? tab.showMenu : showTabOverflowMenu
  const showToolbar = effOpen || effClose || effMenu
  const menuOpenInNew = effMenu && !effOpen
  const menuClose = effMenu && !effClose
  const menuSetDefault = effMenu
  return {
    effOpen,
    effClose,
    effMenu,
    showToolbar,
    menuOpenInNew,
    menuClose,
    menuSetDefault,
  }
}

export function TabStrip({
  tabs = [],
  showAddTab = false,
  addTabLabel = 'Add Tab',
  overflowMode = 'auto',
  overflowTabs = [],
  variant = 'default',
  iconPosition: componentIconPosition,
  showTabOpenInNew = false,
  showTabClose = false,
  showTabOverflowMenu = false,
  className = '',
  onTabSelected,
  onAddTab,
  onCloseTab,
  onOpenNewWindow,
  onSetDefault,
}: TabStripProps) {
  const componentId = useId().replace(/:/g, '')
  const rootRef = useRef<HTMLDivElement>(null)
  const tabsRowRef = useRef<HTMLDivElement>(null)
  const addBtnRef = useRef<HTMLButtonElement>(null)

  const [moreOpen, setMoreOpen] = useState(false)
  const [perTabMenuId, setPerTabMenuId] = useState<string | null>(null)
  const [autoOverflowIds, setAutoOverflowIds] = useState<Set<string>>(() => new Set())

  const showMoreChrome = overflowMode !== 'none'

  const manualMoreVisible =
    overflowMode === 'manual' && overflowTabs.length > 0

  const autoMoreVisible = overflowMode === 'auto' && autoOverflowIds.size > 0

  const moreVisible = showMoreChrome && (manualMoreVisible || autoMoreVisible)

  const tabsInMoreOrder = useMemo(() => {
    if (overflowMode === 'manual') return overflowTabs
    if (overflowMode === 'auto') {
      return tabs.filter((t) => autoOverflowIds.has(t.id))
    }
    return []
  }, [overflowMode, overflowTabs, tabs, autoOverflowIds])

  const tabMeasureKey = useMemo(
    () => tabs.map((t) => `${t.id}:${t.label}:${t.icon ?? ''}`).join('|'),
    [tabs]
  )

  const measureAutoOverflow = useCallback(() => {
    if (overflowMode !== 'auto') return
    const root = rootRef.current
    const tabsRow = tabsRowRef.current
    if (!root || !tabsRow?.parentElement) return

    const parent = tabsRow.parentElement
    const cells = Array.from(
      tabsRow.querySelectorAll<HTMLElement>('[data-tabstrip-tab-cell]')
    )
    if (cells.length === 0) {
      setAutoOverflowIds(new Set())
      return
    }

    cells.forEach((c) => {
      c.style.display = ''
    })

    const addBtn = addBtnRef.current
    let addW = 0
    if (addBtn && addBtn.offsetParent !== null) {
      const cs = getComputedStyle(addBtn)
      addW =
        addBtn.offsetWidth +
        parseInt(cs.marginLeft || '0', 10) +
        parseInt(cs.marginRight || '0', 10)
    }
    const moreReserve = 90
    const available = parent.offsetWidth - addW - moreReserve
    const gap = parseInt(getComputedStyle(tabsRow).gap || '0', 10)

    const widths = cells.map((cell) => {
      const cs = getComputedStyle(cell)
      return (
        cell.offsetWidth +
        parseInt(cs.marginLeft || '0', 10) +
        parseInt(cs.marginRight || '0', 10)
      )
    })

    let total = 0
    const next = new Set<string>()
    for (let i = 0; i < cells.length; i++) {
      const g = i > 0 ? gap : 0
      const w = widths[i]!
      if (total + w + g <= available) {
        total += w + g
      } else {
        const id = cells[i]!.getAttribute('data-tab-id')
        if (id) next.add(id)
      }
    }

    cells.forEach((cell) => {
      const id = cell.getAttribute('data-tab-id')
      if (id && next.has(id)) cell.style.display = 'none'
    })

    setAutoOverflowIds(next)
  }, [overflowMode, tabMeasureKey])

  useLayoutEffect(() => {
    if (overflowMode !== 'auto') {
      setAutoOverflowIds(new Set())
      const cells = tabsRowRef.current?.querySelectorAll<HTMLElement>(
        '[data-tabstrip-tab-cell]'
      )
      cells?.forEach((c) => {
        c.style.display = ''
      })
      return
    }

    measureAutoOverflow()

    const tabsRow = tabsRowRef.current
    const parent = tabsRow?.parentElement
    if (!parent) return

    const ro = new ResizeObserver(() => {
      measureAutoOverflow()
    })
    ro.observe(parent)

    const t = window.setTimeout(() => measureAutoOverflow(), 0)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
    }
  }, [overflowMode, measureAutoOverflow, tabs])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      const root = rootRef.current
      if (!root) return
      if (!root.querySelector('[data-tabstrip-more]')?.contains(t)) {
        setMoreOpen(false)
      }
      const openWrap = root.querySelector('[data-tabstrip-per-tab-menu].is-open')
      if (openWrap && !openWrap.contains(t)) {
        setPerTabMenuId(null)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const dispatch = useCallback(
    (
      action:
        | 'select-tab'
        | 'close-tab'
        | 'open-new-window'
        | 'set-default',
      tabId: string | null
    ) => {
      if (!tabId) return
      if (action === 'select-tab') onTabSelected?.(tabId)
      else if (action === 'close-tab') onCloseTab?.(tabId)
      else if (action === 'open-new-window') onOpenNewWindow?.(tabId)
      else if (action === 'set-default') onSetDefault?.(tabId)
    },
    [onTabSelected, onCloseTab, onOpenNewWindow, onSetDefault]
  )

  const handleMoreToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPerTabMenuId(null)
    setMoreOpen((v) => !v)
  }

  const handleMainDropdownClick = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest(
      '[data-action]'
    ) as HTMLElement | null
    if (!el || el.closest('[data-tabstrip-per-tab-dropdown]')) return
    e.stopPropagation()
    const action = el.getAttribute('data-action')
    const tabId = el.getAttribute('data-tab-id')
    if (
      action === 'select-tab' ||
      action === 'close-tab' ||
      action === 'open-new-window'
    ) {
      dispatch(action, tabId)
    }
    setMoreOpen(false)
  }

  const handlePerTabMenuToggle = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    setMoreOpen(false)
    setPerTabMenuId((cur) => (cur === tabId ? null : tabId))
  }

  const renderTabCell = (tab: TabStripTab) => {
    const iconPosition = componentIconPosition || tab.iconPosition || 'left'
    const iconModifier =
      iconPosition === 'top'
        ? 'tab--icon-top'
        : iconPosition === 'right'
          ? 'tab--icon-right'
          : 'tab--icon-left'

    const {
      effOpen,
      effClose,
      effMenu,
      showToolbar,
      menuOpenInNew,
      menuClose,
      menuSetDefault,
    } = tabEffectiveFlags(tab, showTabOpenInNew, showTabClose, showTabOverflowMenu)

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
      tab.active && 'is-active',
      tab.disabled && 'tab--disabled',
      iconModifier
    )
    const tabIndex = tab.active && !tab.disabled ? 0 : -1

    const tabControl = tab.href ? (
      <a
        href={tab.href}
        role="tab"
        aria-selected={tab.active ? 'true' : 'false'}
        aria-disabled={tab.disabled ? 'true' : 'false'}
        className={tabClasses}
        tabIndex={tabIndex}
        data-tab-id={tab.id}
        data-tab-icon={tab.icon ?? ''}
        onClick={(e) => {
          if (tab.disabled) {
            e.preventDefault()
            return
          }
          dispatch('select-tab', tab.id)
        }}
      >
        {tabContent}
      </a>
    ) : (
      <button
        type="button"
        role="tab"
        aria-selected={tab.active ? 'true' : 'false'}
        aria-disabled={tab.disabled ? 'true' : 'false'}
        className={tabClasses}
        disabled={tab.disabled}
        tabIndex={tabIndex}
        data-tab-id={tab.id}
        data-tab-icon={tab.icon ?? ''}
        onClick={() => {
          if (!tab.disabled) dispatch('select-tab', tab.id)
        }}
      >
        {tabContent}
      </button>
    )

    const menuOpen = perTabMenuId === tab.id

    return (
      <div
        key={tab.id}
        className="tabstrip__tab-cell"
        data-tabstrip-tab-cell
        data-tab-id={tab.id}
      >
        {tabControl}
        {showToolbar && (
          <div className="tabstrip__tab-toolbar" data-tabstrip-tab-toolbar>
            {effOpen && (
              <button
                type="button"
                className="tabstrip__tab-action-btn"
                data-tab-id={tab.id}
                data-action="open-new-window"
                aria-label={`Open ${tab.label} in new window`}
                title="Open in new window"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch('open-new-window', tab.id)
                }}
              >
                <Icon name="arrow-top-right-on-square" size="sm" />
              </button>
            )}
            {effClose && (
              <button
                type="button"
                className="tabstrip__tab-action-btn"
                data-tab-id={tab.id}
                data-action="close-tab"
                aria-label={`Close ${tab.label}`}
                title="Close"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch('close-tab', tab.id)
                }}
              >
                <Icon name="x-mark" size="sm" />
              </button>
            )}
            {effMenu && (
              <div
                className={clsx(
                  'tabstrip__tab-menu-wrapper',
                  menuOpen && 'is-open'
                )}
                data-tabstrip-per-tab-menu
              >
                <button
                  type="button"
                  className="tabstrip__tab-action-btn"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  aria-label={`More actions for ${tab.label}`}
                  data-tabstrip-per-tab-menu-btn
                  onClick={(e) => handlePerTabMenuToggle(e, tab.id)}
                >
                  <Icon name="ellipsis-vertical" size="sm" />
                </button>
                <div
                  className="tabstrip__dropdown tabstrip__dropdown--per-tab"
                  role="menu"
                  aria-label={`${tab.label} tab actions`}
                  data-tabstrip-per-tab-dropdown
                >
                  {menuOpenInNew && (
                    <button
                      type="button"
                      className="tabstrip__dropdown-menu-item"
                      role="menuitem"
                      data-tab-id={tab.id}
                      data-action="open-new-window"
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch('open-new-window', tab.id)
                        setPerTabMenuId(null)
                      }}
                    >
                      Open in new window
                    </button>
                  )}
                  {menuClose && (
                    <button
                      type="button"
                      className="tabstrip__dropdown-menu-item"
                      role="menuitem"
                      data-tab-id={tab.id}
                      data-action="close-tab"
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch('close-tab', tab.id)
                        setPerTabMenuId(null)
                      }}
                    >
                      Close tab
                    </button>
                  )}
                  {menuSetDefault && (
                    <button
                      type="button"
                      className="tabstrip__dropdown-menu-item"
                      role="menuitem"
                      data-tab-id={tab.id}
                      data-action="set-default"
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch('set-default', tab.id)
                        setPerTabMenuId(null)
                      }}
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={clsx(
        'tabstrip',
        variant === 'compact' && 'tabstrip--compact',
        variant === 'pill' && 'tabstrip--pill',
        className
      )}
      data-tabstrip
      data-variant={variant}
      data-overflow-mode={overflowMode}
      id={componentId}
      onKeyDown={(e) => {
        const root = rootRef.current
        if (!root) return
        const isMore = moreOpen
        const perTabOpen = perTabMenuId !== null

        if (e.key === 'Escape') {
          if (isMore) {
            e.preventDefault()
            setMoreOpen(false)
            root.querySelector<HTMLButtonElement>('[data-tabstrip-more-btn]')?.focus()
          } else if (perTabOpen) {
            e.preventDefault()
            const prev = perTabMenuId
            setPerTabMenuId(null)
            if (prev) {
              const safe = prev.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
              root
                .querySelector<HTMLButtonElement>(
                  `[data-tabstrip-tab-cell][data-tab-id="${safe}"] [data-tabstrip-per-tab-menu-btn]`
                )
                ?.focus()
            }
          }
          return
        }

        const mainDd = root.querySelector('[data-tabstrip-dropdown]')
        const moreItems = mainDd
          ? (Array.from(
              mainDd.querySelectorAll<HTMLElement>('[data-action]')
            ) as HTMLElement[])
          : []

        if (isMore && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
          e.preventDefault()
          const i = moreItems.indexOf(
            document.activeElement as HTMLElement
          )
          let next = i < 0 ? 0 : i
          if (e.key === 'ArrowDown')
            next = (next + 1) % moreItems.length
          else if (e.key === 'ArrowUp')
            next = next <= 0 ? moreItems.length - 1 : next - 1
          else if (e.key === 'Home') next = 0
          else if (e.key === 'End') next = moreItems.length - 1
          moreItems[next]?.focus()
          return
        }

        if (perTabOpen && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
          const safe = perTabMenuId!
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
          const wrap = root.querySelector(
            `[data-tabstrip-tab-cell][data-tab-id="${safe}"] [data-tabstrip-per-tab-dropdown]`
          )
          const items = wrap
            ? (Array.from(
                wrap.querySelectorAll<HTMLElement>('[data-action]')
              ) as HTMLElement[])
            : []
          e.preventDefault()
          const i = items.indexOf(document.activeElement as HTMLElement)
          let next = i < 0 ? 0 : i
          if (e.key === 'ArrowDown')
            next = (next + 1) % items.length
          else if (e.key === 'ArrowUp')
            next = next <= 0 ? items.length - 1 : next - 1
          else if (e.key === 'Home') next = 0
          else if (e.key === 'End') next = items.length - 1
          items[next]?.focus()
          return
        }

        if (
          ['ArrowLeft', 'ArrowRight'].includes(e.key) &&
          !isMore &&
          !perTabOpen
        ) {
          e.preventDefault()
          const tabEls = Array.from(
            root.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>(
              '[data-tabstrip-tabs] [data-tabstrip-tab-cell] [role="tab"]'
            )
          ).filter((el) => {
            const cell = el.closest(
              '[data-tabstrip-tab-cell]'
            ) as HTMLElement | null
            return cell && cell.style.display !== 'none'
          })

          const cur = document.activeElement as HTMLElement | null
          if (!cur || !tabEls.includes(cur as HTMLButtonElement)) return

          const idx = tabEls.indexOf(cur as HTMLButtonElement)
          const dir = e.key === 'ArrowLeft' ? -1 : 1
          let next = idx + dir
          if (next < 0) next = tabEls.length - 1
          if (next >= tabEls.length) next = 0
          const nextEl = tabEls[next]
          if (nextEl?.getAttribute('aria-disabled') !== 'true') {
            nextEl.focus()
            if (e.shiftKey || e.ctrlKey) nextEl.click()
          }
        }
      }}
    >
      <nav role="tablist" aria-label="Tabs" className="tabstrip__nav">
        <div className="tabstrip__container">
          <div className="tabstrip__tabs" ref={tabsRowRef} data-tabstrip-tabs>
            {tabs.map((tab) => renderTabCell(tab))}
          </div>

          {showAddTab && (
            <button
              ref={addBtnRef}
              type="button"
              className="tab tabstrip__add"
              aria-label={addTabLabel}
              data-tabstrip-add
              onClick={() => onAddTab?.()}
            >
              <Icon name="plus" size="sm" />
              <span>{addTabLabel}</span>
            </button>
          )}

          {showMoreChrome && (
            <div
              className="tabstrip__more-wrapper"
              data-tabstrip-more
              style={{ display: moreVisible ? 'flex' : 'none' }}
              aria-expanded={moreOpen ? 'true' : 'false'}
            >
              <button
                type="button"
                className="tab tabstrip__more"
                aria-label="Show more tabs"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                data-tabstrip-more-btn
                onClick={handleMoreToggle}
              >
                <span data-tabstrip-more-label>
                  More ({tabsInMoreOrder.length})
                </span>
                <Icon name="ellipsis-horizontal" size="sm" />
              </button>
              <div
                className="tabstrip__dropdown"
                role="menu"
                aria-label="Overflow tabs menu"
                data-tabstrip-dropdown
                onClick={handleMainDropdownClick}
              >
                <div
                  className="tabstrip__dropdown-section"
                  data-tabstrip-dropdown-items
                >
                  {tabsInMoreOrder.map((tab) => (
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
