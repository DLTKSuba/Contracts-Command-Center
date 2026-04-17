import clsx from 'clsx'
import { Button } from './Button'
import './ShellPageHeader.css'

export interface ShellPageHeaderButtonConfig {
  text: string
  icon?: string
  href?: string
}

const DEFAULT_PRIMARY: ShellPageHeaderButtonConfig = { text: 'Primary' }
const DEFAULT_OUTLINE: ShellPageHeaderButtonConfig = { text: 'Secondary' }

export interface ShellPageHeaderProps {
  title: string
  subtitle?: string
  showDefaultButtons?: boolean
  primaryButton?: ShellPageHeaderButtonConfig
  outlineButton1?: ShellPageHeaderButtonConfig
  outlineButton2?: ShellPageHeaderButtonConfig
  outlineButton3?: ShellPageHeaderButtonConfig
  className?: string
  actions?: React.ReactNode
}

export function ShellPageHeader({
  title,
  subtitle,
  showDefaultButtons = true,
  primaryButton,
  outlineButton1,
  outlineButton2,
  outlineButton3,
  className = '',
  actions,
}: ShellPageHeaderProps) {
  const useDefaultButtons =
    showDefaultButtons &&
    primaryButton === undefined &&
    outlineButton1 === undefined &&
    outlineButton2 === undefined &&
    outlineButton3 === undefined &&
    actions == null

  const effectiveOutline1 = useDefaultButtons ? DEFAULT_OUTLINE : outlineButton1
  const effectiveOutline2 = outlineButton2
  const effectiveOutline3 = outlineButton3
  const effectivePrimary = useDefaultButtons ? DEFAULT_PRIMARY : primaryButton

  const outlineButtons = [effectiveOutline1, effectiveOutline2, effectiveOutline3].filter(
    (b): b is ShellPageHeaderButtonConfig => Boolean(b)
  )
  const showDefaultActions = outlineButtons.length > 0 || effectivePrimary

  return (
    <header className={clsx('shell-page-header', className)}>
      <div className="shell-page-header__left">
        <h1 className="shell-page-header__title">{title}</h1>
        {subtitle && (
          <p className="shell-page-header__subtitle">{subtitle}</p>
        )}
      </div>
      {actions != null ? (
        <div className="shell-page-header__actions">{actions}</div>
      ) : showDefaultActions ? (
        <div className="shell-page-header__actions">
          {outlineButtons.map((button, i) => (
            <Button
              key={i}
              variant="secondary"
              buttonType="pageHeader"
              size="md"
              icon={button.icon}
              href={button.href}
            >
              {button.text}
            </Button>
          ))}
          {effectivePrimary && (
            <Button
              variant="primary"
              buttonType="pageHeader"
              size="md"
              icon={effectivePrimary.icon}
              href={effectivePrimary.href}
            >
              {effectivePrimary.text}
            </Button>
          )}
        </div>
      ) : null}
    </header>
  )
}
