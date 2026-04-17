import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './Button'
import { Icon } from './Icon'
import { Card } from './Card'
import { KanbanCard, type KanbanCardProps } from './KanbanCard'
import './Kanban.css'

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCardProps[]
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
  columns: KanbanColumn[]
  title?: string
  actionButtons?: ActionButton[]
  actionDropdowns?: ActionDropdown[]
  className?: string
  showAddButton?: boolean
  titleBarActions?: ReactNode
  actionBar?: ReactNode
}

export function Kanban({
  columns,
  title = 'Kanban Board',
  actionButtons = [],
  actionDropdowns: _actionDropdowns = [],
  className = '',
  showAddButton = true,
  titleBarActions,
  actionBar,
}: KanbanProps) {
  const hasTitleBarActions = titleBarActions != null
  const hasActionBarSlot = actionBar != null

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
        {columns.map((column) => {
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
