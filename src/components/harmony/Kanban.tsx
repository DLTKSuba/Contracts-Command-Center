import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './Button'
import { Icon } from './Icon'
import { Card } from './Card'
import { Input } from './Input'
import { KanbanCard, type KanbanCardProps } from './KanbanCard'
import { KanbanCardCostpoint } from './KanbanCardCostpoint'
import type { KanbanViewCardField } from '../../types/kanban-view-config'
import type { Option } from './Dropdown'
import './Kanban.css'
import './KanbanCostpoint.css'

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCardProps[]
}

export interface KanbanCostpointCard {
  id: string
  title: string
  valuesByFieldName: Record<string, string | undefined>
  selected?: boolean
  graphicalClass?: string
}

export interface KanbanCostpointColumn {
  id: string
  title: string
  cards: KanbanCostpointCard[]
  /** Hex for this column’s primary top border accent (same role as default Kanban column border colors). */
  headerColorLight?: string
  loadMoreRemaining?: number
}

export interface ActionButton {
  text: string
  icon?: string
}

export interface ActionDropdown {
  text: string
  options?: Array<{ value: string; label: string }>
  value?: string
}

export interface KanbanProps {
  columns: KanbanColumn[] | KanbanCostpointColumn[]
  variant?: 'default' | 'costpoint'
  title?: string
  actionButtons?: ActionButton[]
  actionDropdowns?: ActionDropdown[]
  className?: string
  showAddButton?: boolean
  titleBarActions?: ReactNode
  actionBar?: ReactNode
  cardFieldsConfig?: KanbanViewCardField[]
  cpRecordCount?: number
  cpRecordShown?: number
  cpRecordTotal?: number
  cpToolbarTitle?: string
  cpSortedBy?: string
  cpSortLabel?: string
  cpActiveView?: 'table' | 'form' | 'kanban'
  cpSearchPlaceholder?: string
  cpScrollColumnIndex?: number
  showLoadMore?: boolean
  cpToolbar?: ReactNode
  cpBoardHeader?: ReactNode
}

export function Kanban({
  columns,
  variant = 'default',
  title = 'Kanban Board',
  actionButtons = [],
  actionDropdowns: _actionDropdowns = [],
  className = '',
  showAddButton = true,
  titleBarActions,
  actionBar,
  cardFieldsConfig = [],
  cpRecordCount: cpRecordCountProp,
  cpRecordShown: cpRecordShownProp,
  cpRecordTotal: cpRecordTotalProp,
  cpSortedBy,
  cpSortLabel = 'Due Date',
  cpSearchPlaceholder = 'Quick search…',
  cpScrollColumnIndex = 0,
  showLoadMore = true,
  cpToolbar,
  cpBoardHeader,
}: KanbanProps) {
  const hasTitleBarActions = titleBarActions != null
  const hasActionBarSlot = actionBar != null
  const isCostpoint = variant === 'costpoint'
  const cpColumns = isCostpoint ? (columns as KanbanCostpointColumn[]) : []
  const moveOptionsAll: Option[] = isCostpoint
    ? cpColumns.map((c) => ({ value: c.id, label: c.title }))
    : []

  const cpRecordCount =
    cpRecordCountProp ??
    (isCostpoint ? cpColumns.reduce((n, col) => n + col.cards.length, 0) : 0)

  const cpTotalRecords = cpRecordTotalProp ?? cpRecordCount
  const cpShownRecords = cpRecordShownProp ?? cpRecordCount
  const cpSortFieldLabel = cpSortedBy ?? cpSortLabel

  const cpColumnCount = isCostpoint ? cpColumns.length : 0
  const cpNavPrevDisabled = cpScrollColumnIndex <= 0
  const cpNavNextDisabled = cpScrollColumnIndex >= Math.max(0, cpColumnCount - 1)

  if (isCostpoint) {
    return (
      <div className={clsx('kanban-cp', className)}>
        {cpToolbar != null ? <div className="kanban-cp__toolbar">{cpToolbar}</div> : null}

        <div className="kanban-cp__board-header">
          {cpBoardHeader ?? (
            <>
              <div className="kanban-cp__board-meta">
                <span>
                  Showing {cpShownRecords} of {cpTotalRecords} records
                </span>
                <span className="kanban-cp__board-meta-sep" aria-hidden="true">
                  |
                </span>
                <span>Sorted by: {cpSortFieldLabel}</span>
              </div>
              <div className="kanban-cp__board-search">
                <Input
                  type="search"
                  name="kanban-cp-search"
                  id="kanban-cp-search"
                  placeholder={cpSearchPlaceholder}
                  icon="magnifying-glass"
                  className="kanban-cp__search-input"
                  aria-label="Quick search"
                />
              </div>
              <button type="button" className="kanban-cp__board-settings" aria-label="Board settings">
                <Icon name="cog-6-tooth" size="sm" />
              </button>
            </>
          )}
        </div>

        <div className="kanban-cp__columns-outer">
          <div className="kanban-cp__col-nav">
            <button
              type="button"
              className="kanban-cp__col-nav-btn"
              disabled={cpNavPrevDisabled}
              aria-label="Previous column"
            >
              <Icon name="chevron-left" size="sm" />
            </button>
          </div>

          <div className="kanban-cp__col-scroll">
            <div className="kanban-cp__columns" role="region" aria-label="Kanban columns" tabIndex={0}>
              {cpColumns.map((column) => {
                const loadMoreSuffix =
                  column.loadMoreRemaining != null && column.loadMoreRemaining > 0
                    ? ` (${column.loadMoreRemaining})`
                    : ''
                const columnWrapStyle: CSSProperties | undefined =
                  column.headerColorLight !== undefined
                    ? ({ ['--kanban-cp-column-accent']: column.headerColorLight } as CSSProperties)
                    : undefined
                return (
                  <div key={column.id} className="kanban-cp__column-wrap" style={columnWrapStyle}>
                    <Card primary className="kanban-cp__column-card">
                      <article className="kanban-cp__column" aria-label={`${column.title} column`}>
                        <header className="kanban-cp__column-header">
                          <div className="kanban-cp__column-header-content">
                            <h2 className="kanban-cp__column-title" title={column.title}>
                              {column.title}
                            </h2>
                            <span
                              className="kanban-cp__column-count"
                              aria-label={`${column.cards.length} items`}
                            >
                              {column.cards.length}
                            </span>
                          </div>
                        </header>
                        <div className="kanban-cp__column-body">
                          {cardFieldsConfig.length > 0 &&
                            column.cards.map((card) => {
                              const moveOptions: Option[] = moveOptionsAll.map((o) => ({
                                ...o,
                                disabled: o.value === column.id,
                              }))
                              return (
                                <KanbanCardCostpoint
                                  key={card.id}
                                  id={card.id}
                                  title={card.title}
                                  fieldsConfig={cardFieldsConfig}
                                  valuesByFieldName={card.valuesByFieldName}
                                  selected={card.selected}
                                  graphicalClass={card.graphicalClass}
                                  moveOptions={moveOptions}
                                />
                              )
                            })}
                          {showLoadMore && (
                            <div className="kanban-cp__load-more">
                              <button
                                type="button"
                                className="kanban-cp__load-more-link"
                                aria-label={`Load more cards in ${column.title}`}
                              >
                                Load more{loadMoreSuffix}
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    </Card>
                  </div>
                )
              })}
            </div>

            <div className="kanban-cp__col-dots" role="tablist" aria-label="Column position">
              {cpColumns.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="kanban-cp__col-dot"
                  aria-label={`Column ${i + 1}`}
                  aria-current={i === cpScrollColumnIndex ? true : undefined}
                />
              ))}
            </div>
          </div>

          <div className="kanban-cp__col-nav">
            <button
              type="button"
              className="kanban-cp__col-nav-btn"
              disabled={cpNavNextDisabled}
              aria-label="Next column"
            >
              <Icon name="chevron-right" size="sm" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const defaultColumns = columns as KanbanColumn[]
  return (
    <div className={clsx('kanban__container', className)}>
      <div className="kanban__title-bar">
        <div className="kanban__title-bar-content">
          <h1 className="kanban__title">{title}</h1>
          <div className="kanban__title-bar-actions">
            {hasTitleBarActions ? (
              titleBarActions
            ) : (
              <>
                <button type="button" className="kanban__title-bar-icon" aria-label="Expand view">
                  <Icon name="arrows-pointing-out" size="sm" />
                </button>
                <button type="button" className="kanban__title-bar-icon" aria-label="Collapse view">
                  <Icon name="arrows-pointing-in" size="sm" />
                </button>
                <button type="button" className="kanban__title-bar-icon" aria-label="Help">
                  <Icon name="question-mark-circle" size="sm" />
                </button>
                <button type="button" className="kanban__title-bar-icon" aria-label="Minimize">
                  <Icon name="minimize" size="sm" />
                </button>
                <button type="button" className="kanban__title-bar-icon" aria-label="Window">
                  <Icon name="window" size="sm" />
                </button>
                <button type="button" className="kanban__title-bar-icon" aria-label="Close">
                  <Icon name="x-mark" size="sm" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="kanban__action-bar">
        <div className="kanban__action-items">
          {hasActionBarSlot ? (
            actionBar
          ) : actionButtons.length > 0 ? (
            actionButtons.map((button, index) => (
              <span key={index}>
                {index > 0 && <span className="kanban__action-divider">|</span>}
                <Button buttonType="theme" variant="ghost" size="sm" className="kanban__action-button">
                  {button.icon && <Icon name={button.icon} size="sm" />}
                  {button.text}
                </Button>
              </span>
            ))
          ) : (
            <>
              <Button buttonType="theme" variant="ghost" size="sm" className="kanban__action-button">
                <Icon name="trash" size="sm" /> Delete
              </Button>
              <Button buttonType="theme" variant="ghost" size="sm" className="kanban__action-button">
                <Icon name="queue-list" size="sm" /> Group
              </Button>
              <Button buttonType="theme" variant="ghost" size="sm" className="kanban__action-button">
                Subcards: Collapse all <Icon name="chevron-up" size="sm" />
              </Button>
              <span className="kanban__action-divider">|</span>
              <Button buttonType="theme" variant="ghost" size="sm" className="kanban__action-button">
                <Icon name="cog-6-tooth" size="sm" /> Customize Columns
              </Button>
              <span className="kanban__action-label">All Filters</span>
              <span className="kanban__action-divider">|</span>
              <button type="button" className="kanban__action-text-button">
                <span>Change Views</span>
                <Icon name="chevron-down" size="sm" />
              </button>
            </>
          )}
        </div>
      </div>

      <section className="kanban__columns-wrapper" role="region" aria-label="Kanban board">
        {defaultColumns.map((column) => {
          const titleLower = column.title.toLowerCase()
          let borderColorClass = ''
          if (titleLower.includes('in progress') || titleLower.includes('in-progress')) {
            borderColorClass = 'kanban__column-card--in-progress'
          } else if (titleLower === 'done') {
            borderColorClass = 'kanban__column-card--done'
          }
          return (
            <Card
              key={column.id}
              primary
              className={clsx('kanban__column-card', borderColorClass)}
            >
              <article
                className="kanban__column"
                role="group"
                aria-label={`${column.title} column`}
              >
                <header className="kanban__column-header">
                  <div className="kanban__column-header-content">
                    <h2 className="kanban__column-title">{column.title}</h2>
                    <span className="kanban__column-count" aria-label={`${column.cards.length} items`}>
                      {column.cards.length}
                    </span>
                  </div>
                  <div className="kanban__column-header-actions">
                    <button type="button" className="kanban__column-action-icon" aria-label="Column settings">
                      <Icon name="cog" size="sm" />
                    </button>
                    <button type="button" className="kanban__column-action-icon" aria-label="Column menu">
                      <Icon name="ellipsis-vertical" size="sm" />
                    </button>
                    <button type="button" className="kanban__column-action-icon" aria-label="Close column">
                      <Icon name="x-mark" size="sm" />
                    </button>
                  </div>
                </header>
                <div className="kanban__column-content">
                  {column.cards.map((card) => (
                    <KanbanCard
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      description={card.description}
                      avatar={card.avatar}
                      badges={card.badges}
                      progress={card.progress}
                      icons={card.icons}
                      date={card.date}
                      time={card.time}
                      className={card.className}
                    />
                  ))}
                  {showAddButton && (
                    <Button
                      buttonType="theme"
                      variant="tertiary"
                      size="sm"
                      className="kanban__add-button"
                      aria-label={`Add card to ${column.title}`}
                    >
                      <Icon name="plus" size="sm" /> Add card
                    </Button>
                  )}
                </div>
              </article>
            </Card>
          )
        })}
        <Button
          buttonType="theme"
          variant="secondary"
          size="sm"
          className="kanban__add-column-button"
          aria-label="Add new column"
        >
          <Icon name="plus" size="sm" />
        </Button>
      </section>
    </div>
  )
}
