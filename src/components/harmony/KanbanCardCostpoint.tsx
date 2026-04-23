import clsx from 'clsx'
import { Card } from './Card'
import { Dropdown, type Option } from './Dropdown'
import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import type { KanbanViewCardField } from '../../types/kanban-view-config'
import { buildCostpointFieldRows } from '../../utils/kanban-cp-card'

export interface KanbanCardCostpointProps {
  id: string
  title: string
  fieldsConfig: KanbanViewCardField[]
  valuesByFieldName: Record<string, string | undefined>
  selected?: boolean
  moveOptions: Option[]
  graphicalClass?: string
  /** Optional top accent strip (advanced; built-in Kanban does not set this) */
  accentColor?: string
  className?: string
  openRecordLabel?: string
}

export function KanbanCardCostpoint({
  id,
  title,
  fieldsConfig,
  valuesByFieldName,
  selected = false,
  moveOptions,
  graphicalClass = '',
  accentColor,
  className = '',
  openRecordLabel = 'Open record',
}: KanbanCardCostpointProps) {
  const rows = buildCostpointFieldRows(fieldsConfig, valuesByFieldName)

  return (
    <Card
      className={clsx('kanban-card-cp', selected && 'kanban-card-cp--selected', className)}
      elevated
      data-kanban-card-id={id}
    >
      {accentColor ? (
        <div
          className="kanban-card-cp__graphic kanban-card-cp__graphic--accent"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
      ) : graphicalClass ? (
        <div className={clsx('kanban-card-cp__graphic', graphicalClass)} aria-hidden />
      ) : null}
      <div className="kanban-card-cp__title-row">
        <h3 className="kanban-card-cp__title">
          <Tooltip text={title} position="top" className="kanban-card-cp__title-tooltip">
            <span className="kanban-card-cp__title-text">{title}</span>
          </Tooltip>
        </h3>
        <div className="kanban-card-cp__menu">
          <Dropdown
            id={`kanban-cp-move-${id}`}
            options={moveOptions}
            placeholder="Move card"
            className="kanban-card-cp__move-dropdown"
            trigger={
              <span className="kanban-card-cp__kebab-trigger">
                <Icon name="ellipsis-vertical" size="sm" />
                <span className="sr-only">Move card to column</span>
              </span>
            }
          />
        </div>
      </div>

      <div className="kanban-card-cp__fields">
        {rows.map((row, idx) =>
          row.kind === 'spacer' ? (
            <div key={`spacer-${idx}`} className="kanban-card-cp__spacer" aria-hidden />
          ) : row.multiline ? (
            <div key={row.position} className="kanban-card-cp__field">
              <span className="kanban-card-cp__field-label">{row.label}</span>
              <div
                className={clsx(
                  'kanban-card-cp__field-line',
                  'kanban-card-cp__field-line--multiline',
                  row.styleClass
                )}
              >
                {row.value || '\u00a0'}
              </div>
            </div>
          ) : (
            <div key={row.position} className="kanban-card-cp__field">
              <span className="kanban-card-cp__field-label">{row.label}</span>
              <Tooltip text={`${row.label}: ${row.value || '(empty)'}`} position="top">
                <div className={clsx('kanban-card-cp__field-line', row.styleClass)}>
                  {row.value || '\u00a0'}
                </div>
              </Tooltip>
            </div>
          )
        )}
      </div>

      <div className="kanban-card-cp__footer">
        <button type="button" className="kanban-card-cp__open-link">
          {openRecordLabel}
        </button>
      </div>
    </Card>
  )
}
