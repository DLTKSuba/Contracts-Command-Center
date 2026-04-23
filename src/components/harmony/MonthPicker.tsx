import { useState, useId, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './MonthPicker.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseValue(value: string | undefined): { year: number; month: number | null } {
  let year = new Date().getFullYear()
  let month: number | null = null
  if (value) {
    const parts = value.split('-')
    if (parts.length >= 2) {
      year = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
    }
  }
  return { year, month }
}

function parseMinMax(str: string | undefined): { year: number | null; month: number | null } {
  if (!str) return { year: null, month: null }
  const parts = str.split('-')
  if (parts.length < 2) return { year: null, month: null }
  return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) - 1 }
}

export interface MonthPickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  locale?: string
  id?: string
  className?: string
  onMonthSelect?: (value: string) => void
}

export function MonthPicker({
  value,
  min,
  max,
  disabled = false,
  locale: _locale = 'en-US',
  id,
  className = '',
  onMonthSelect,
}: MonthPickerProps) {
  const generatedId = useId().replace(/:/g, '-')
  const pickerId = id || `month-picker-${generatedId}`

  const initial = parseValue(value)
  const [viewYear, setViewYear] = useState(initial.year)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(initial.month)

  const minBounds = parseMinMax(min)
  const maxBounds = parseMinMax(max)

  const handlePrevYear = useCallback(() => setViewYear((y) => y - 1), [])
  const handleNextYear = useCallback(() => setViewYear((y) => y + 1), [])

  const handleSelectMonth = useCallback(
    (index: number) => {
      if (disabled) return
      setSelectedMonth(index)
      const monthStr = String(index + 1).padStart(2, '0')
      const iso = `${viewYear}-${monthStr}`
      onMonthSelect?.(iso)
      const el = document.getElementById(pickerId)
      if (el) {
        el.dispatchEvent(new CustomEvent('month-select', { detail: { value: iso }, bubbles: true }))
      }
    },
    [disabled, viewYear, onMonthSelect, pickerId]
  )

  return (
    <div
      className={clsx('month-picker', className)}
      id={pickerId}
      data-month-picker
      data-year={viewYear}
      data-selected-month={selectedMonth !== null ? String(selectedMonth) : ''}
      data-min-year={minBounds.year?.toString() ?? ''}
      data-min-month={minBounds.month?.toString() ?? ''}
      data-max-year={maxBounds.year?.toString() ?? ''}
      data-max-month={maxBounds.month?.toString() ?? ''}
      data-disabled={String(disabled)}
    >
      <div className="month-picker__header">
        <button
          type="button"
          className="month-picker__nav-btn"
          data-prev-year
          aria-label="Previous year"
          disabled={disabled}
          onClick={handlePrevYear}
        >
          <Icon name="chevron-left" size="sm" />
        </button>
        <div className="month-picker__year">
          <span>{viewYear}</span>
        </div>
        <button
          type="button"
          className="month-picker__nav-btn"
          data-next-year
          aria-label="Next year"
          disabled={disabled}
          onClick={handleNextYear}
        >
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>
      <div className="month-picker__grid" role="grid" aria-label={`Months for ${viewYear}`}>
        {MONTH_NAMES_SHORT.map((label, index) => {
          const isDisabled =
            (minBounds.year != null && minBounds.month != null && (viewYear < minBounds.year || (viewYear === minBounds.year && index < minBounds.month))) ||
            (maxBounds.year != null && maxBounds.month != null && (viewYear > maxBounds.year || (viewYear === maxBounds.year && index > maxBounds.month)))
          const isSelected = selectedMonth === index
          return (
            <button
              key={index}
              type="button"
              className={clsx(
                'month-picker__month',
                isSelected && 'month-picker__month--selected',
                isDisabled && 'month-picker__month--disabled'
              )}
              data-month={index}
              disabled={disabled || isDisabled}
              role="gridcell"
              aria-label={`${MONTH_NAMES[index]} ${viewYear}${isSelected ? ', selected' : ''}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabled && handleSelectMonth(index)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
