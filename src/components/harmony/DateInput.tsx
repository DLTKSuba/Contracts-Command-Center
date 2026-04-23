import { useState, useId, useCallback } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Label } from './Label'
import { PickerPopup } from './PickerPopup'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'
import { DateTimePicker } from './DateTimePicker'
import { MonthPicker } from './MonthPicker'
import { WeekPicker } from './WeekPicker'
import './DateInput.css'

const PLACEHOLDER_MAP: Record<string, string> = {
  date: 'Select date',
  time: 'Select time',
  'datetime-local': 'Select date & time',
  month: 'Select month',
  week: 'Select week',
}

function formatDisplayValue(
  val: string | undefined,
  inputType: string,
  locale: string
): string {
  if (!val) return ''
  try {
    if (inputType === 'date') {
      const date = new Date(val + 'T00:00:00')
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
    }
    if (inputType === 'time') {
      const parts = val.split(':')
      if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1]}`
      return val
    }
    if (inputType === 'datetime-local') {
      const [datePart, timePart] = val.split('T')
      const date = new Date(datePart + 'T00:00:00')
      const dateStr = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
      const timeStr = timePart ? timePart.split('.')[0] : ''
      return `${dateStr} ${timeStr}`
    }
    if (inputType === 'month') {
      const [y, m] = val.split('-')
      const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1)
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' })
    }
    if (inputType === 'week') {
      const match = val.match(/(\d{4})-W(\d{2})/)
      if (match) return `${match[1]}, Week ${parseInt(match[2], 10)}`
      return val
    }
  } catch {
    return val
  }
  return val
}

export type DateInputType = 'date' | 'time' | 'datetime-local' | 'month' | 'week'

export interface DateInputProps {
  type?: DateInputType
  value?: string
  name?: string
  id?: string
  disabled?: boolean
  min?: string
  max?: string
  required?: boolean
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  timeFormat?: '12' | '24'
  locale?: string
  className?: string
  onChange?: (value: string) => void
  'aria-label'?: string
}

export function DateInput({
  type = 'date',
  value,
  name,
  id,
  disabled = false,
  min,
  max,
  required = false,
  label,
  labelVariant,
  labelFor,
  timeFormat = '24',
  locale = 'en-US',
  className = '',
  onChange,
  'aria-label': ariaLabel,
}: DateInputProps) {
  const generatedId = useId().replace(/:/g, '-')
  const dateInputId = id || `date-input-${generatedId}`
  const popupId = `${dateInputId}-popup`

  const [open, setOpen] = useState(false)
  const displayValue = formatDisplayValue(value, type, locale)
  const placeholder = PLACEHOLDER_MAP[type] ?? PLACEHOLDER_MAP.date
  const iconName = type === 'time' ? 'clock' : 'calendar'

  const handleOpen = useCallback(() => {
    if (disabled) return
    setOpen(true)
  }, [disabled])

  const handleClose = useCallback(() => setOpen(false), [])

  const handleSelect = useCallback(
    (newValue: string) => {
      onChange?.(newValue)
      setOpen(false)
    },
    [onChange]
  )

  const wrapperClasses = clsx(
    'date-input-form-wrapper',
    label && labelVariant && `date-input-form-wrapper--${labelVariant}`
  )

  const inputClasses = clsx('date-input', className)

  const content = (
    <>
      <div className="date-input-wrapper">
        <input
          type="text"
          value={displayValue}
          name={name}
          id={dateInputId}
          disabled={disabled}
          required={required}
          className={inputClasses}
          placeholder={placeholder}
          readOnly
          data-date-input
          data-input-type={type}
          aria-label={ariaLabel ?? label ?? placeholder}
          onClick={handleOpen}
        />
        <input type="hidden" name={name} value={value ?? ''} data-date-input-value />
        <button
          type="button"
          className="date-input-wrapper__icon"
          data-date-input-icon={dateInputId}
          aria-label={`Open ${placeholder}`}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleOpen}
        >
          <Icon name={iconName} size="sm" />
        </button>
        <PickerPopup
          id={popupId}
          triggerId={dateInputId}
          className="date-input-popup"
          open={open}
          onClose={handleClose}
        >
          {type === 'date' && (
            <DatePicker
              value={value}
              min={min}
              max={max}
              disabled={disabled}
              locale={locale}
              id={`${dateInputId}-picker`}
              onDateSelect={handleSelect}
            />
          )}
          {type === 'time' && (
            <TimePicker
              value={value}
              min={min}
              max={max}
              disabled={disabled}
              format={timeFormat}
              id={`${dateInputId}-picker`}
              onTimeSelect={handleSelect}
            />
          )}
          {type === 'datetime-local' && (
            <DateTimePicker
              value={value}
              min={min}
              max={max}
              disabled={disabled}
              timeFormat={timeFormat}
              locale={locale}
              id={`${dateInputId}-picker`}
              onDateTimeSelect={handleSelect}
            />
          )}
          {type === 'month' && (
            <MonthPicker
              value={value}
              min={min}
              max={max}
              disabled={disabled}
              id={`${dateInputId}-picker`}
              onMonthSelect={handleSelect}
            />
          )}
          {type === 'week' && (
            <WeekPicker
              value={value}
              min={min}
              max={max}
              disabled={disabled}
              locale={locale}
              id={`${dateInputId}-picker`}
              onWeekSelect={handleSelect}
            />
          )}
        </PickerPopup>
      </div>
    </>
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? dateInputId}
          className={labelVariant === 'inline' || !labelVariant ? 'date-input-form-wrapper__label' : ''}
        >
          {label}
        </Label>
        {content}
      </div>
    )
  }

  return content
}
