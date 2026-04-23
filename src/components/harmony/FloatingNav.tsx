import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './FloatingNav.css'

export interface FloatingNavProps {
  showExecute?: boolean
  saveDisabled?: boolean
  variant?: 'full' | 'compact'
  /** Custom actions content; when provided, replaces the default button group */
  actions?: ReactNode
}

export function FloatingNav({
  showExecute = true,
  saveDisabled = false,
  variant = 'full',
  actions,
}: FloatingNavProps) {
  const hasActionsSlot = actions != null

  return (
    <div className="floating-nav">
      <div className="floating-nav__toolbar">
        {hasActionsSlot ? (
          actions
        ) : (
          <>
            <div className="floating-nav__buttons">
              {showExecute && variant === 'full' && (
                <button type="button" className="floating-nav__btn floating-nav__btn--secondary">
                  Execute
                </button>
              )}
              <button type="button" className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--dropdown">
                <span className="floating-nav__btn-text">Actions</span>
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>
              <button type="button" className="floating-nav__btn floating-nav__btn--secondary floating-nav__btn--icon-dropdown">
                <Icon name="arrow-path" size="md" className="floating-nav__btn-icon" />
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>
              <button
                type="button"
                className={clsx(
                  'floating-nav__btn',
                  'floating-nav__btn--dropdown',
                  saveDisabled ? 'floating-nav__btn--disabled' : 'floating-nav__btn--primary'
                )}
                disabled={saveDisabled}
              >
                <span className="floating-nav__btn-text">Save</span>
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>
            </div>
            <div className="floating-nav__divider" />
            <button type="button" className="floating-nav__pin" aria-label="Pin navigation">
              <Icon name="pin" size="md" className="floating-nav__pin-icon" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
