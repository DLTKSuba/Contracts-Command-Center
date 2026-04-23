import { useState, useId, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './WeekPicker.css'

function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { year: d.getUTCFullYear(), week }
}

function getDateFromISOWeek(year: number, week: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dow = simple.getDay()
  const ISOweekStart = new Date(simple)
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }
  return ISOweekStart
}

function getWeeksForYear(year: number): Array<{ week: number; startDate: Date; endDate: Date }> {
  const weeks: Array<{ week: number; startDate: Date; endDate: Date }> = []
  const firstDay = new Date(year, 0, 1)
  const lastDay = new Date(year, 11, 31)
  const firstWeek = getISOWeek(firstDay)
  const lastWeek = getISOWeek(lastDay)
  const startYear = firstWeek.year
  const endYear = lastWeek.year

  for (let y = startYear; y <= endYear; y++) {
    const yearEnd = new Date(y, 11, 31)
    const yearEndWeek = getISOWeek(yearEnd)
    const maxWeeks = yearEndWeek.week
    for (let w = 1; w <= maxWeeks; w++) {
      const weekStart = getDateFromISOWeek(y, w)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      if (
        weekStart.getFullYear() === year ||
        weekEnd.getFullYear() === year ||
        (weekStart.getFullYear() < year && weekEnd.getFullYear() >= year)
      ) {
        weeks.push({ week: w, startDate: weekStart, endDate: weekEnd })
      }
    }
  }
  return weeks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

function parseValue(value: string | undefined): { year: number; week: number | null } {
  let year = new Date().getFullYear()
  let week: number | null = null
  if (value) {
    const match = value.match(/(\d{4})-W(\d{2})/)
    if (match) {
      year = parseInt(match[1], 10)
      week = parseInt(match[2], 10)
    }
  }
  return { year, week }
}

function parseMinMax(str: string | undefined): { year: number | null; week: number | null } {
  if (!str) return { year: null, week: null }
  const match = str.match(/(\d{4})-W(\d{2})/)
  if (!match) return { year: null, week: null }
  return { year: parseInt(match[1], 10), week: parseInt(match[2], 10) }
}

export interface WeekPickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  locale?: string
  id?: string
  className?: string
  onWeekSelect?: (value: string) => void
}

export function WeekPicker({
  value,
  min,
  max,
  disabled = false,
  locale = 'en-US',
  id,
  className = '',
  onWeekSelect,
}: WeekPickerProps) {
  const generatedId = useId().replace(/:/g, '-')
  const pickerId = id || `week-picker-${generatedId}`

  const initial = parseValue(value)
  const [viewYear, setViewYear] = useState(initial.year)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(initial.week)

  const minBounds = parseMinMax(min)
  const maxBounds = parseMinMax(max)

  const weeks = useMemo(() => getWeeksForYear(viewYear), [viewYear])

  const handlePrevYear = useCallback(() => setViewYear((y) => y - 1), [])
  const handleNextYear = useCallback(() => setViewYear((y) => y + 1), [])

  const handleSelectWeek = useCallback(
    (week: number, weekStr: string) => {
      if (disabled) return
      setSelectedWeek(week)
      onWeekSelect?.(weekStr)
      const el = document.getElementById(pickerId)
      if (el) {
        el.dispatchEvent(new CustomEvent('week-select', { detail: { value: weekStr }, bubbles: true }))
      }
    },
    [disabled, onWeekSelect, pickerId]
  )

  return (
    <div
      className={clsx('week-picker', className)}
      id={pickerId}
      data-week-picker
      data-year={viewYear}
      data-selected-week={selectedWeek?.toString() ?? ''}
      data-min-year={minBounds.year?.toString() ?? ''}
      data-min-week={minBounds.week?.toString() ?? ''}
      data-max-year={maxBounds.year?.toString() ?? ''}
      data-max-week={maxBounds.week?.toString() ?? ''}
      data-disabled={String(disabled)}
    >
      <div className="week-picker__header">
        <button
          type="button"
          className="week-picker__nav-btn"
          data-prev-year
          aria-label="Previous year"
          disabled={disabled}
          onClick={handlePrevYear}
        >
          <Icon name="chevron-left" size="sm" />
        </button>
        <div className="week-picker__year">
          <span>{viewYear}</span>
        </div>
        <button
          type="button"
          className="week-picker__nav-btn"
          data-next-year
          aria-label="Next year"
          disabled={disabled}
          onClick={handleNextYear}
        >
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>
      <div className="week-picker__list" role="listbox" aria-label={`Weeks for ${viewYear}`}>
        {weeks.map((weekData) => {
          const weekStr = `${viewYear}-W${String(weekData.week).padStart(2, '0')}`
          const isDisabled =
            (minBounds.year != null && minBounds.week != null && (viewYear < minBounds.year || (viewYear === minBounds.year && weekData.week < minBounds.week))) ||
            (maxBounds.year != null && maxBounds.week != null && (viewYear > maxBounds.year || (viewYear === maxBounds.year && weekData.week > maxBounds.week)))
          const isSelected = selectedWeek === weekData.week
          const startStr = weekData.startDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
          const endStr = weekData.endDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
          return (
            <button
              key={weekStr}
              type="button"
              className={clsx(
                'week-picker__week',
                isSelected && 'week-picker__week--selected',
                isDisabled && 'week-picker__week--disabled'
              )}
              data-week={weekData.week}
              data-week-value={weekStr}
              disabled={disabled || isDisabled}
              role="option"
              aria-label={`Week ${weekData.week}, ${startStr} to ${endStr}${isSelected ? ', selected' : ''}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabled && handleSelectWeek(weekData.week, weekStr)}
            >
              <span className="week-picker__week-number">Week {weekData.week}</span>
              <span className="week-picker__week-range">{startStr} - {endStr}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
