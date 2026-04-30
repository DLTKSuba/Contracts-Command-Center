import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  DEFAULT_LIFECYCLE_PROJECTS,
  ProjectFilterControl,
} from './ProjectFilterControl'
import type { ProjectRow } from './ProjectFilterControl'
import './LifecycleBarChart.css'

export interface LifecycleBarChartBar {
  id: string
  label: string
  value: number
  color: string
  /** Shown as tooltip / assistive description */
  description?: string
}

export interface LifecycleBarChartProps {
  title: string
  bars: LifecycleBarChartBar[]
  /** Top of Y-axis (e.g. 200); bars scale to this max */
  yAxisMax: number
  /** Label on the trigger when every project is selected */
  filterLabel?: string
  /** Projects shown in the selector (defaults to sample PRJ list) */
  projects?: ProjectRow[]
  /** Controlled: selected project IDs (omit for uncontrolled default: all projects) */
  selectedProjectIds?: string[]
  onSelectedProjectIdsChange?: (ids: string[]) => void
  /** Optional status definitions (e.g. requisition lifecycle copy) */
  legendItems?: string[]
  legendTitle?: string
  /** Renders inside the same bordered container (e.g. lifecycle data table). */
  children?: ReactNode
  /** Merged onto the table wrapper (e.g. `position: relative` for an inline detail panel). */
  tableWrapperClassName?: string
  className?: string
  /** Bar `id`s currently included in the lifecycle table filter (multi-select). */
  selectedBarIds?: readonly string[]
  /** Toggle a bar in/out of the filter; parent updates `selectedBarIds`. */
  onBarToggle?: (barId: string) => void
  /** Shown under project scope when a bar filter is active (plain sentence). */
  statusTableHint?: string | null
}

export function LifecycleBarChart({
  title,
  bars,
  yAxisMax,
  filterLabel = 'All Projects',
  projects: projectsProp,
  selectedProjectIds: selectedProjectIdsProp,
  onSelectedProjectIdsChange,
  legendItems,
  legendTitle = 'Status definitions',
  children,
  tableWrapperClassName,
  className = '',
  selectedBarIds: selectedBarIdsProp,
  onBarToggle,
  statusTableHint = null,
}: LifecycleBarChartProps) {
  const selectedBarIds = selectedBarIdsProp ?? []
  const projects = useMemo(
    () =>
      projectsProp != null && projectsProp.length > 0 ? projectsProp : DEFAULT_LIFECYCLE_PROJECTS,
    [projectsProp]
  )

  const allIds = useMemo(() => projects.map((p) => p.id), [projects])
  const idsKey = allIds.join('|')

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(() => allIds)

  const selectionControlled = selectedProjectIdsProp !== undefined
  const selectedProjectIds = selectionControlled ? selectedProjectIdsProp! : internalSelectedIds

  const setSelectedProjectIds = (ids: string[]) => {
    if (!selectionControlled) setInternalSelectedIds(ids)
    onSelectedProjectIdsChange?.(ids)
  }

  useEffect(() => {
    if (selectionControlled || allIds.length === 0) return
    setInternalSelectedIds((prev) => {
      const allowed = new Set(allIds)
      const next = prev.filter((id) => allowed.has(id))
      if (next.length === 0) return [...allIds]
      return next
    })
  }, [selectionControlled, idsKey, allIds])

  const ticks = 5
  const tickValues = Array.from({ length: ticks }, (_, i) => {
    const step = yAxisMax / (ticks - 1)
    return Math.round(yAxisMax - i * step)
  })

  const barFilterActive = onBarToggle != null && selectedBarIds.length > 0

  const summary = `${title}: ${bars.map((b) => `${b.label} ${b.value}`).join(', ')}`

  const scopeSummary = useMemo(() => {
    if (selectedProjectIds.length === projects.length) {
      return `Includes all ${projects.length} projects.`
    }
    if (selectedProjectIds.length === 0) {
      return 'No projects selected — choose projects and click Apply.'
    }
    return `Filtered to ${selectedProjectIds.length} of ${projects.length} projects.`
  }, [selectedProjectIds, projects])

  return (
    <section
      className={clsx('lifecycle-bar-chart', barFilterActive && 'lifecycle-bar-chart--status-filter-on', className)}
      aria-label={summary}
    >
      <div className="lifecycle-bar-chart__header">
        <h3 className="lifecycle-bar-chart__title">{title}</h3>
        <ProjectFilterControl
          className="lifecycle-bar-chart__project-filter"
          projects={projects}
          value={selectedProjectIds}
          onChange={setSelectedProjectIds}
          allLabel={filterLabel}
        />
      </div>
      <p className="lifecycle-bar-chart__scope-line" aria-live="polite">
        {scopeSummary}
      </p>
      {statusTableHint != null && statusTableHint.trim() !== '' && (
        <p className="lifecycle-bar-chart__status-filter-hint" aria-live="polite">
          {statusTableHint}
        </p>
      )}

      <div className="lifecycle-bar-chart__plot">
        <div className="lifecycle-bar-chart__y-axis" aria-hidden="true">
          {tickValues.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>

        <div className="lifecycle-bar-chart__bars-wrap">
          <div className="lifecycle-bar-chart__grid" aria-hidden="true" />
          <div className="lifecycle-bar-chart__bars" role="list">
            {bars.map((bar) => {
              const pct = yAxisMax > 0 ? Math.min(100, (bar.value / yAxisMax) * 100) : 0
              const interactive = onBarToggle != null
              const selected = selectedBarIds.includes(bar.id)
              const dimmed = barFilterActive && !selected
              const toggleBar = () => {
                onBarToggle?.(bar.id)
              }
              const track = (
                <div className="lifecycle-bar-chart__track">
                  <span
                    className="lifecycle-bar-chart__value"
                    style={{
                      bottom: `calc(${pct}% + 4px)`,
                    }}
                  >
                    {bar.value}
                  </span>
                  <div
                    className="lifecycle-bar-chart__bar"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: bar.color,
                    }}
                    role="presentation"
                  />
                </div>
              )
              return (
                <div
                  key={bar.id}
                  className={clsx(
                    'lifecycle-bar-chart__column',
                    interactive && 'lifecycle-bar-chart__column--interactive',
                    selected && 'lifecycle-bar-chart__column--selected',
                    dimmed && 'lifecycle-bar-chart__column--dimmed',
                  )}
                  role="listitem"
                  title={bar.description ?? bar.label}
                >
                  {interactive ? (
                    <button
                      type="button"
                      className="lifecycle-bar-chart__column-hit"
                      aria-pressed={selected}
                      aria-label={`${bar.label}. ${selected ? 'Selected; press to remove from table filter.' : 'Press to add to table filter.'}`}
                      onClick={toggleBar}
                    >
                      {track}
                    </button>
                  ) : (
                    track
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="lifecycle-bar-chart__baseline" aria-hidden="true" />

        <div className="lifecycle-bar-chart__x-labels" role="list">
          {bars.map((bar) => {
            const interactive = onBarToggle != null
            const selected = selectedBarIds.includes(bar.id)
            const dimmed = barFilterActive && !selected
            const toggleBar = () => {
              onBarToggle?.(bar.id)
            }
            const inner = <span className="lifecycle-bar-chart__label-cell-inner">{bar.label}</span>
            return (
              <div
                key={`${bar.id}-label`}
                className={clsx(
                  'lifecycle-bar-chart__label-cell',
                  interactive && 'lifecycle-bar-chart__label-cell--interactive',
                  selected && 'lifecycle-bar-chart__label-cell--selected',
                  dimmed && 'lifecycle-bar-chart__label-cell--dimmed',
                )}
                role="listitem"
                title={bar.description ?? bar.label}
              >
                {interactive ? (
                  <button
                    type="button"
                    className="lifecycle-bar-chart__label-hit"
                    aria-pressed={selected}
                    aria-label={`${bar.label}. ${selected ? 'Selected; press to remove from table filter.' : 'Press to add to table filter.'}`}
                    onClick={toggleBar}
                  >
                    {inner}
                  </button>
                ) : (
                  inner
                )}
              </div>
            )
          })}
        </div>
      </div>

      {legendItems != null && legendItems.length > 0 && (
        <div className="lifecycle-bar-chart__legend">
          <h4 className="lifecycle-bar-chart__legend-title">{legendTitle}</h4>
          <ol className="lifecycle-bar-chart__legend-list">
            {legendItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {children != null && (
        <div className={clsx('lifecycle-bar-chart__table', tableWrapperClassName)}>{children}</div>
      )}
    </section>
  )
}
