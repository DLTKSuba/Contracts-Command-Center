import clsx from 'clsx'
import { Icon } from './Icon'
import './ListMenu.css'

export interface MenuItem {
  icon?: string
  label: string
  href?: string
  active?: boolean
  isCustom?: boolean
  customSrc?: string
}

export interface ListMenuProps {
  items: MenuItem[]
  as?: 'button' | 'link'
  variant?: 'default' | 'no-borders'
  className?: string
  onItemClick?: (item: MenuItem, index: number) => void
}

export function ListMenu({
  items,
  as = 'button',
  variant = 'default',
  className = '',
  onItemClick,
}: ListMenuProps) {
  return (
    <div
      className={clsx(
        'list-menu',
        variant === 'no-borders' && 'list-menu--no-borders',
        className
      )}
    >
      {items.map((item, index) => {
        const isLink = as === 'link'
        const commonClass = clsx('list-menu__item', item.active && 'is-active')
        if (isLink) {
          return (
            <a
              key={index}
              href={item.href ?? '#'}
              className={commonClass}
              onClick={() => onItemClick?.(item, index)}
            >
              {item.isCustom && item.customSrc ? (
                <img src={item.customSrc} alt={item.label} className="list-menu__item-icon list-menu__custom-icon" />
              ) : item.icon ? (
                <Icon name={item.icon} size="md" className="list-menu__item-icon" />
              ) : null}
              {item.label}
            </a>
          )
        }
        return (
          <button
            key={index}
            type="button"
            className={commonClass}
            onClick={() => onItemClick?.(item, index)}
          >
            {item.isCustom && item.customSrc ? (
              <img src={item.customSrc} alt={item.label} className="list-menu__item-icon list-menu__custom-icon" />
            ) : item.icon ? (
              <Icon name={item.icon} size="md" className="list-menu__item-icon" />
            ) : null}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
