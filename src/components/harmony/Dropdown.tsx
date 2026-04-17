import type { ReactNode } from 'react'
import { useState, useId, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import { Label } from './Label'
import './Dropdown.css'

export interface Option {
  value: string
  label: string
  disabled?: boolean
}

export interface DropdownProps {
  options: Option[]
  value?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  className?: string
  label?: string
  labelVariant?: 'inline' | 'stacked'
  labelFor?: string
  /** Custom trigger content (replaces default trigger with value + chevron) */
  trigger?: ReactNode
  /** Custom content per option for first 10 options (option-0 through option-9) */
  optionSlots?: (ReactNode | null)[]
  onChange?: (value: string) => void
}

export function Dropdown({
  options,
  value,
  placeholder = 'Select an option',
  name,
  id,
  disabled = false,
  className = '',
  label,
  labelVariant,
  labelFor,
  trigger: triggerSlot,
  optionSlots,
  onChange,
}: DropdownProps) {
  const generatedId = useId().replace(/:/g, '-')
  const dropdownId = id || `dropdown-${generatedId}`
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? '')
  const controlled = value !== undefined
  const currentValue = controlled ? value : internalValue
  const selectedOption = options.find((opt) => opt.value === currentValue)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  const handleTriggerClick = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleOptionClick = (option: Option) => {
    if (option.disabled) return
    if (!controlled) setInternalValue(option.value)
    onChange?.(option.value)
    setIsOpen(false)
  }

  const finalLabelVariant = labelVariant
  const wrapperClasses = clsx(
    'dropdown-wrapper',
    label && finalLabelVariant && `dropdown-wrapper--${finalLabelVariant}`
  )
  const classes = clsx('dropdown', className)
  const labelClass =
    finalLabelVariant === 'inline' || !finalLabelVariant ? 'dropdown-wrapper__label' : ''

  const triggerContent = triggerSlot ?? (
    <>
      <span className="dropdown__value">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <Icon name="chevron-down" className="dropdown__chevron" />
    </>
  )

  const dropdownBlock = (
    <div
      ref={containerRef}
      className={clsx(classes, isOpen && 'is-open')}
      data-dropdown
      id={dropdownId}
    >
      <button
        type="button"
        className="dropdown__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
      >
        {triggerContent}
      </button>
      <div className="dropdown__menu" role="listbox">
        {options.map((option, optIndex) => {
          const customContent = optionSlots && optIndex < optionSlots.length ? optionSlots[optIndex] : null
          const isSelected = option.value === currentValue
          return (
            <button
              key={option.value}
              type="button"
              className={clsx(
                'dropdown__item',
                isSelected && 'is-selected',
                option.disabled && 'dropdown__item--disabled'
              )}
              data-value={option.value}
              disabled={option.disabled}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleOptionClick(option)}
            >
              {customContent != null ? customContent : option.label}
            </button>
          )
        })}
      </div>
      <input type="hidden" name={name} value={currentValue || ''} />
    </div>
  )

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label htmlFor={labelFor || dropdownId} className={labelClass}>
          {label}
        </Label>
        {dropdownBlock}
      </div>
    )
  }

  return dropdownBlock
}
