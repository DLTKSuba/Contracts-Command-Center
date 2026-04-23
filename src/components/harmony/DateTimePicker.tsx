import { useId, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'
import './DateTimePicker.css'

export interface DateTimePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  timeFormat?: '12' | '24'
  locale?: string
  id?: string
  className?: string
  onDateTimeSelect?: (datetime: string) => void
}

export function DateTimePicker({
  value,
  min,
  max,
  disabled = false,
  timeFormat = '24',
  locale = 'en-US',
  id,
  className = '',
  onDateTimeSelect,
}: DateTimePickerProps) {
  const generatedId = useId().replace(/:/g, '-')
  const pickerId = id || `datetime-picker-${generatedId}`

  const dateValue = value ? value.split('T')[0] : undefined
  const timeValue = value ? value.split('T')[1]?.split('.')[0] : undefined
  const minDate = min ? (min.includes('T') ? min.split('T')[0] : min) : undefined
  const minTime = min && min.includes('T') ? min.split('T')[1]?.split('.')[0] : undefined
  const maxDate = max ? (max.includes('T') ? max.split('T')[0] : max) : undefined
  const maxTime = max && max.includes('T') ? max.split('T')[1]?.split('.')[0] : undefined

  const selectedDateRef = useRef<string | null>(dateValue ?? null)
  const selectedTimeRef = useRef<string | null>(timeValue ?? null)

  const updateDateTime = useCallback(
    (date: string | null, time: string | null) => {
      if (date != null) selectedDateRef.current = date
      if (time != null) selectedTimeRef.current = time
      const d = selectedDateRef.current
      const t = selectedTimeRef.current
      if (d && t) {
        const datetime = `${d}T${t}`
        onDateTimeSelect?.(datetime)
        const el = document.getElementById(pickerId)
        if (el) {
          el.dispatchEvent(new CustomEvent('datetime-select', { detail: { datetime }, bubbles: true }))
        }
      }
    },
    [onDateTimeSelect, pickerId]
  )

  const handleDateSelect = useCallback(
    (date: string) => {
      updateDateTime(date, null)
    },
    [updateDateTime]
  )
  const handleTimeSelect = useCallback(
    (time: string) => {
      updateDateTime(null, time)
    },
    [updateDateTime]
  )

  return (
    <div
      className={clsx('datetime-picker', className)}
      id={pickerId}
      data-datetime-picker
    >
      <div className="datetime-picker__date-section">
        <DatePicker
          value={dateValue}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          locale={locale}
          id={`${pickerId}-date`}
          onDateSelect={handleDateSelect}
        />
      </div>
      <div className="datetime-picker__time-section">
        <TimePicker
          value={timeValue}
          min={minTime}
          max={maxTime}
          disabled={disabled}
          format={timeFormat}
          id={`${pickerId}-time`}
          onTimeSelect={handleTimeSelect}
        />
      </div>
    </div>
  )
}
