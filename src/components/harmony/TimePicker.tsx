import { useState, useId, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './TimePicker.css'

function formatTimeOutput(hour: number, minute: number, period: 'AM' | 'PM', format: '12' | '24'): string {
  let h = hour
  if (format === '24') {
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
  }
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function parseTimeValue(value: string | undefined, format: '12' | '24'): { hour: number; minute: number; period: 'AM' | 'PM' } {
  let hour = 0
  let minute = 0
  let period: 'AM' | 'PM' = 'AM'
  if (value) {
    const parts = value.split(':')
    if (parts.length >= 2) {
      hour = parseInt(parts[0]) || 0
      minute = parseInt(parts[1]) || 0
      if (format === '12') {
        if (hour >= 12) {
          period = 'PM'
          if (hour > 12) hour -= 12
        } else {
          period = 'AM'
          if (hour === 0) hour = 12
        }
      }
    }
  }
  return { hour, minute, period }
}

export interface TimePickerProps {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  format?: '12' | '24'
  step?: number
  id?: string
  className?: string
  onTimeSelect?: (time: string) => void
}

export function TimePicker({
  value,
  min,
  max,
  disabled = false,
  format = '24',
  step = 1,
  id,
  className = '',
  onTimeSelect,
}: TimePickerProps) {
  const generatedId = useId().replace(/:/g, '-')
  const pickerId = id || `time-picker-${generatedId}`

  const parsed = parseTimeValue(value, format)
  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period)

  const clampMinMax = useCallback(
    (h: number, m: number, p: 'AM' | 'PM'): boolean => {
      if (!min && !max) return true
      const timeStr = formatTimeOutput(h, m, p, format)
      const [th, tm] = timeStr.split(':').map(Number)
      const timeMins = th * 60 + tm
      if (min) {
        const [minH, minM] = min.split(':').map(Number)
        if (timeMins < minH * 60 + (minM || 0)) return false
      }
      if (max) {
        const [maxH, maxM] = max.split(':').map(Number)
        if (timeMins > maxH * 60 + (maxM || 0)) return false
      }
      return true
    },
    [min, max, format]
  )

  const updateTime = useCallback(
    (newHour: number, newMinute: number, newPeriod: 'AM' | 'PM') => {
      if (format === '12') {
        if (newHour < 1) newHour = 12
        if (newHour > 12) newHour = 1
      } else {
        if (newHour < 0) newHour = 23
        if (newHour > 23) newHour = 0
      }
      if (newMinute < 0) newMinute = 59
      if (newMinute > 59) newMinute = 0
      newMinute = Math.round(newMinute / step) * step
      if (newMinute > 59) newMinute = 0
      if (!clampMinMax(newHour, newMinute, newPeriod)) return
      setHour(newHour)
      setMinute(newMinute)
      setPeriod(newPeriod)
      const timeStr = formatTimeOutput(newHour, newMinute, newPeriod, format)
      onTimeSelect?.(timeStr)
      const el = document.getElementById(pickerId)
      if (el) {
        el.dispatchEvent(new CustomEvent('time-select', { detail: { time: timeStr }, bubbles: true }))
      }
    },
    [format, step, clampMinMax, onTimeSelect, pickerId]
  )

  const displayHour = format === '12' ? (period === 'AM' && hour === 0 ? 12 : hour) : hour
  const displayMinute = minute

  return (
    <div
      className={clsx('time-picker', className)}
      id={pickerId}
      data-time-picker
      data-format={format}
      data-step={step}
      data-disabled={String(disabled)}
      data-min-time={min || ''}
      data-max-time={max || ''}
    >
      <div className="time-picker__controls">
        <div className="time-picker__hour">
          <button
            type="button"
            className="time-picker__increment"
            data-increment="hour"
            aria-label="Increment hour"
            disabled={disabled}
            onClick={() => updateTime(hour + 1, minute, period)}
          >
            <Icon name="chevron-up" size="sm" />
          </button>
          <input
            type="text"
            className="time-picker__input"
            data-hour-input
            value={String(displayHour).padStart(2, '0')}
            readOnly
            aria-label="Hour"
          />
          <button
            type="button"
            className="time-picker__decrement"
            data-decrement="hour"
            aria-label="Decrement hour"
            disabled={disabled}
            onClick={() => updateTime(hour - 1, minute, period)}
          >
            <Icon name="chevron-down" size="sm" />
          </button>
        </div>
        <span className="time-picker__separator">:</span>
        <div className="time-picker__minute">
          <button
            type="button"
            className="time-picker__increment"
            data-increment="minute"
            aria-label="Increment minute"
            disabled={disabled}
            onClick={() => updateTime(hour, minute + step, period)}
          >
            <Icon name="chevron-up" size="sm" />
          </button>
          <input
            type="text"
            className="time-picker__input"
            data-minute-input
            value={String(displayMinute).padStart(2, '0')}
            readOnly
            aria-label="Minute"
          />
          <button
            type="button"
            className="time-picker__decrement"
            data-decrement="minute"
            aria-label="Decrement minute"
            disabled={disabled}
            onClick={() => updateTime(hour, minute - step, period)}
          >
            <Icon name="chevron-down" size="sm" />
          </button>
        </div>
        {format === '12' && (
          <div className="time-picker__period">
            <button
              type="button"
              className={clsx(
                'time-picker__period-btn',
                period === 'AM' && 'time-picker__period-btn--active'
              )}
              data-period="AM"
              aria-label="AM"
              disabled={disabled}
              onClick={() => updateTime(hour, minute, 'AM')}
            >
              AM
            </button>
            <button
              type="button"
              className={clsx(
                'time-picker__period-btn',
                period === 'PM' && 'time-picker__period-btn--active'
              )}
              data-period="PM"
              aria-label="PM"
              disabled={disabled}
              onClick={() => updateTime(hour, minute, 'PM')}
            >
              PM
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
