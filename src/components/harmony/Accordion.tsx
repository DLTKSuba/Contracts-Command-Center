import { useState, useId, type ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Accordion.css'

export interface AccordionItem {
  title: string
  content: string
  defaultOpen?: boolean
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
  /** Optional label above the accordion; sets role="group" and aria-labelledby on the control */
  label?: string
  /** Optional custom content per item (item-0 through item-9); when provided, overrides item.content for that index */
  itemSlots?: (ReactNode | null)[]
}

export function Accordion({
  items,
  allowMultiple = false,
  className = '',
  label,
  itemSlots,
}: AccordionProps) {
  const baseId = useId().replace(/:/g, '-')
  const labelId = `${baseId}-label`
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    const indices = new Set<number>()
    items.forEach((item, i) => {
      if (item.defaultOpen && !item.disabled) indices.add(i)
    })
    if (!allowMultiple && indices.size > 0) {
      const lastOpen = Math.max(...Array.from(indices))
      return new Set([lastOpen])
    }
    return indices
  })

  const handleTriggerClick = (index: number) => {
    if (items[index]?.disabled) return
    setOpenIndices((prev) => {
      const next = new Set(prev)
      const isOpen = next.has(index)
      if (!allowMultiple) {
        next.clear()
      }
      if (!isOpen) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }

  return (
    <div className={clsx('accordion-field', className)}>
      {label ? (
        <p id={labelId} className="accordion-field__label">
          {label}
        </p>
      ) : null}
      <div className="accordion-field__surface">
        <div
          className="accordion"
          data-accordion
          {...(allowMultiple && { 'data-allow-multiple': true })}
          {...(label && { role: 'group', 'aria-labelledby': labelId })}
        >
          {items.map((item, index) => {
            const isOpen = openIndices.has(index)
            const panelId = `${baseId}-panel-${index}`
            const customContent = itemSlots && index < itemSlots.length ? itemSlots[index] : null
            const bodyContent = customContent != null ? customContent : item.content
            const disabled = Boolean(item.disabled)

            return (
              <div
                key={index}
                className={clsx('accordion__item', isOpen && 'is-open', disabled && 'accordion__item--disabled')}
                data-accordion-item
              >
                <button
                  type="button"
                  className="accordion__trigger"
                  disabled={disabled}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => handleTriggerClick(index)}
                >
                  {item.title}
                  <Icon name="chevron-down" className="accordion__icon" />
                </button>
                <div className="accordion__content" id={panelId} role="region">
                  {bodyContent}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
