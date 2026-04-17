import { useState, useId, type ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Accordion.css'

export interface AccordionItem {
  title: string
  content: string
  defaultOpen?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
  /** Optional custom content per item (item-0 through item-9); when provided, overrides item.content for that index */
  itemSlots?: (ReactNode | null)[]
}

export function Accordion({
  items,
  allowMultiple = false,
  className = '',
  itemSlots,
}: AccordionProps) {
  const accordionId = useId().replace(/:/g, '-')
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    const indices = new Set<number>()
    items.forEach((item, i) => {
      if (item.defaultOpen) indices.add(i)
    })
    if (!allowMultiple && indices.size > 0) {
      const lastOpen = Math.max(...Array.from(indices))
      return new Set([lastOpen])
    }
    return indices
  })

  const handleTriggerClick = (index: number) => {
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
    <div
      className={clsx('accordion', className)}
      data-accordion
      {...(allowMultiple && { 'data-allow-multiple': true })}
    >
      {items.map((item, index) => {
        const isOpen = openIndices.has(index)
        const panelId = `${accordionId}-panel-${index}`
        const customContent = itemSlots && index < itemSlots.length ? itemSlots[index] : null
        const bodyContent = customContent != null ? customContent : item.content

        return (
          <div
            key={index}
            className={clsx('accordion__item', isOpen && 'is-open')}
            data-accordion-item
          >
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleTriggerClick(index)}
            >
              {item.title}
              <Icon name="chevron-down" className="accordion__icon" />
            </button>
            <div
              className="accordion__content"
              id={panelId}
              role="region"
            >
              {bodyContent}
            </div>
          </div>
        )
      })}
    </div>
  )
}
