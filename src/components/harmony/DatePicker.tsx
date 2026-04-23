import { useState, useId, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './DatePicker.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  return isNaN(date.getTime()) ? null : date
}

function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() === d2.getTime()
}

function getCalendarDays(month: number, year: number): Array<{ date: Date; isCurrentMonth: boolean }> {
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
  const current = new Date(startDate)
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
    })
    current.setDate(current.getDate() + 1)
  }
  return days
}

export interface DatePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  locale?: string
  id?: string
  className?: string
  onDateSelect?: (date: string) => void
}

export function DatePicker({
  value,
  min,
  max,
  disabled = false,
  locale = 'en-US',
  id,
  className = '',
  onDateSelect,
}: DatePickerProps) {
  const generatedId = useId().replace(/:/g, '-')
  const pickerId = id || `date-picker-${generatedId}`

  const valueDate = value ? parseDate(value) : null
  const initialDate = valueDate || new Date()
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(value || null)

  const handlePrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m <= 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }, [])
  const handleNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m >= 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }, [])

  const handleSelectDate = useCallback(
    (dateStr: string) => {
      if (disabled) return
      setSelectedDate(dateStr)
      onDateSelect?.(dateStr)
      const el = document.getElementById(pickerId)
      if (el) {
        el.dispatchEvent(new CustomEvent('date-select', { detail: { date: dateStr }, bubbles: true }))
      }
    },
    [disabled, onDateSelect, pickerId]
  )

  const calendarDays = getCalendarDays(viewMonth, viewYear)
  const minDate = min ? parseDate(min) : null
  const maxDate = max ? parseDate(max) : null
  const selected = selectedDate ? parseDate(selectedDate) : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div
      className={clsx('date-picker', className)}
      id={pickerId}
      data-date-picker
      data-month={viewMonth}
      data-year={viewYear}
      data-selected-date={selectedDate || ''}
      data-min-date={min || ''}
      data-max-date={max || ''}
      data-locale={locale}
      data-disabled={String(disabled)}
    >
      <div className="date-picker__header">
        <button
          type="button"
          className="date-picker__nav-btn"
          data-prev-month
          aria-label="Previous month"
          disabled={disabled}
          onClick={handlePrevMonth}
        >
          <Icon name="chevron-left" size="sm" />
        </button>
        <div className="date-picker__month-year">
          <span className="date-picker__month">{MONTH_NAMES[viewMonth]}</span>
          <span className="date-picker__year">{viewYear}</span>
        </div>
        <button
          type="button"
          className="date-picker__nav-btn"
          data-next-month
          aria-label="Next month"
          disabled={disabled}
          onClick={handleNextMonth}
        >
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>
      <div className="date-picker__weekdays">
        {DAY_NAMES.map((day, index) => (
          <div key={index} className="date-picker__weekday" aria-label={day}>
            {day}
          </div>
        ))}
      </div>
      <div
        className="date-picker__grid"
        role="grid"
        aria-label={`Calendar for ${MONTH_NAMES[viewMonth]} ${viewYear}`}
        data-calendar-grid
      >
        {calendarDays.map((day) => {
          const dayDate = new Date(day.date)
          dayDate.setHours(0, 0, 0, 0)
          const dateStr = formatDate(dayDate)
          const isDisabledDate =
            (minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)
          const isToday = isSameDay(dayDate, today)
          const isSelected = selected && isSameDay(dayDate, selected)
          return (
            <button
              key={dateStr}
              type="button"
              className={clsx(
                'date-picker__day',
                !day.isCurrentMonth && 'date-picker__day--other-month',
                isToday && 'date-picker__day--today',
                isSelected && 'date-picker__day--selected',
                isDisabledDate && 'date-picker__day--disabled'
              )}
              data-date={dateStr}
              disabled={disabled || !!isDisabledDate}
              role="gridcell"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabledDate && handleSelectDate(dateStr)}
            >
              {dayDate.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
