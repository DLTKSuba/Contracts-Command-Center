import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Dropdown } from './Dropdown'
import type { Option } from './Dropdown'
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
  /** Label for the default “all” scope when `filterOptions` is not provided */
  filterLabel?: string
  /** Harmony Dropdown options (defaults: All Projects + common scopes) */
  filterOptions?: Option[]
  /** Controlled filter value (must match an option `value`) */
  filterValue?: string
  onFilterChange?: (value: string) => void
  /** Optional status definitions (e.g. requisition lifecycle copy) */
  legendItems?: string[]
  legendTitle?: string
  /** Renders inside the same bordered container (e.g. lifecycle data table). */
  children?: ReactNode
  /** Merged onto the table wrapper (e.g. `position: relative` for an inline detail panel). */
  tableWrapperClassName?: string
  className?: string
}

const DEFAULT_FILTER_OPTIONS = (allLabel: string): Option[] => [
  { value: 'all', label: allLabel },
  { value: 'active', label: 'Active projects' },
  { value: 'recent', label: 'Recently updated' },
]

export function LifecycleBarChart({
  title,
  bars,
  yAxisMax,
  filterLabel = 'All Projects',
  filterOptions: filterOptionsProp,
  filterValue: filterValueProp,
  onFilterChange,
  legendItems,
  legendTitle = 'Status definitions',
  children,
  tableWrapperClassName,
  className = '',
}: LifecycleBarChartProps) {
  const [internalFilter, setInternalFilter] = useState('all')
  const controlled = filterValueProp !== undefined
  const filterValue = controlled ? filterValueProp : internalFilter

  const filterOptions = useMemo(() => {
    if (filterOptionsProp != null && filterOptionsProp.length > 0) return filterOptionsProp
    return DEFAULT_FILTER_OPTIONS(filterLabel)
  }, [filterOptionsProp, filterLabel])

  const handleFilterChange = (value: string) => {
    if (!controlled) setInternalFilter(value)
    onFilterChange?.(value)
  }

  const ticks = 5
  const tickValues = Array.from({ length: ticks }, (_, i) => {
    const step = yAxisMax / (ticks - 1)
    return Math.round(yAxisMax - i * step)
  })

  const summary = `${title}: ${bars.map((b) => `${b.label} ${b.value}`).join(', ')}`

  return (
    <section className={clsx('lifecycle-bar-chart', className)} aria-label={summary}>
      <div className="lifecycle-bar-chart__header">
        <h3 className="lifecycle-bar-chart__title">{title}</h3>
        <Dropdown
          className="lifecycle-bar-chart__dropdown"
          options={filterOptions}
          value={filterValue}
          onChange={handleFilterChange}
          placeholder={filterLabel}
        />
      </div>

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
              return (
                <div
                  key={bar.id}
                  className="lifecycle-bar-chart__column"
                  role="listitem"
                  title={bar.description ?? bar.label}
                >
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
                </div>
              )
            })}
          </div>
        </div>

        <div className="lifecycle-bar-chart__baseline" aria-hidden="true" />

        <div className="lifecycle-bar-chart__x-labels" role="list">
          {bars.map((bar) => (
            <div
              key={`${bar.id}-label`}
              className="lifecycle-bar-chart__label-cell"
              role="listitem"
              title={bar.description ?? bar.label}
            >
              <span className="lifecycle-bar-chart__label-cell-inner">{bar.label}</span>
            </div>
          ))}
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
