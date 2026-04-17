import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Card } from './Card'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Icon } from './Icon'
import { ProgressBar } from './ProgressBar'
import './KanbanCard.css'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'orange' | 'pink' | 'disabled'

export interface KanbanCardProps {
  id: string
  title?: string
  description?: string
  avatar?: { name?: string; size?: 'sm' | 'md' | 'lg' }
  badges?: Array<{ label: string; variant?: BadgeVariant }>
  progress?: number
  icons?: Array<{ name: string; size?: 'xs' | 'sm' | 'md' }>
  date?: string
  time?: string
  className?: string
  children?: ReactNode
}

export function KanbanCard({
  id: _id,
  title,
  description,
  avatar,
  badges = [],
  progress,
  icons = [],
  date,
  time,
  className = '',
  children,
}: KanbanCardProps) {
  return (
    <Card className={clsx('kanban-card', className)} elevated>
      <div className="kanban-card__header">
        <Avatar size={avatar?.size ?? 'sm'} className="kanban-card__avatar" />
        <div className="kanban-card__header-right">
          {icons.length > 0 && (
            <div className="kanban-card__icons">
              {icons.map((icon, index) => (
                <Icon
                  key={index}
                  name={icon.name}
                  size={icon.size ?? 'sm'}
                  className="kanban-card__icon"
                />
              ))}
            </div>
          )}
          {badges.length > 0 && (
            <div className="kanban-card__badges">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant ?? 'default'}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      {title && <h3 className="kanban-card__title">{title}</h3>}
      {description && <p className="kanban-card__description">{description}</p>}
      {progress !== undefined && (
        <div className="kanban-card__progress">
          <ProgressBar value={progress} size="sm" />
        </div>
      )}
      <div className="kanban-card__date-time">
        {date && <span className="kanban-card__date">Date: {date}</span>}
        {time && <span className="kanban-card__time">Time: {time}</span>}
      </div>
      {children ?? (
        <span className="kanban-card__body-default">Card content. Override by passing default slot content.</span>
      )}
    </Card>
  )
}
