import clsx from 'clsx'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey = 'critical' | 'warning' | 'upcoming'

type TierCardModel = {
  tier: ExpirationTierKey
  /** KPI headline (expiry window copy). */
  windowLabel: string
  count: number
  /** Calendar date for the first expiring contract in this tier. */
  firstExpiresDate: string
  /** Days-in-parentheses suffix, e.g. "5d" → rendered as "(5d)". Empty hides parens. */
  daysUntilShort: string
}

/** Derived from grid data — null when no contracts in tier within the 90-day window. */
export type TierExpiryLine = {
  firstExpiresDate: string
  daysUntilShort: string
} | null

const CRITICAL_META = {
  tier: 'critical' as const,
  windowLabel: 'Expires within 30 days',
}

const WARNING_META = {
  tier: 'warning' as const,
  windowLabel: 'Expires in 31–60 days',
}

const UPCOMING_META = {
  tier: 'upcoming' as const,
  windowLabel: 'Expires in 61–90 days',
}

function TierCard({
  meta,
  expiryLine,
  count,
  selected,
  onSelect,
}: {
  meta: Omit<TierCardModel, 'count' | 'firstExpiresDate' | 'daysUntilShort'>
  expiryLine: TierExpiryLine
  count: number
  selected: boolean
  onSelect: () => void
}) {
  const headingId = `ced-${meta.tier}-heading`
  const card: TierCardModel = {
    ...meta,
    count,
    firstExpiresDate: expiryLine?.firstExpiresDate ?? '—',
    daysUntilShort: expiryLine?.daysUntilShort ?? '',
  }

  return (
    <article
      className={clsx(
        'ced-card',
        `ced-card--${card.tier}`,
        selected && 'ced-card--selected',
      )}
      aria-labelledby={headingId}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={(e) => {
        e.preventDefault()
        onSelect()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <div className="ced-card__accent" aria-hidden />
      <div className="ced-card__body">
        <p className="ced-card__window-label" id={headingId}>
          {card.windowLabel}
        </p>
        <div className="ced-card__value-stack">
          <p className="ced-card__count" aria-label={`${card.count} contracts`}>
            {card.count}
          </p>
          <p className="ced-card__expires-line">
            <span className="ced-card__first-expiry-prefix">First expiry </span>
            <span className="ced-card__expires-date">{card.firstExpiresDate}</span>
            {card.daysUntilShort ? (
              <span className="ced-card__expires-paren"> ({card.daysUntilShort})</span>
            ) : null}
          </p>
        </div>
      </div>
    </article>
  )
}

export type ContractsExpirationDashboardProps = {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierExpiryLines: {
    critical: TierExpiryLine
    warning: TierExpiryLine
    upcoming: TierExpiryLine
  }
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}

export function ContractsExpirationDashboard({
  tierCounts,
  tierExpiryLines,
  selectedTier,
  onSelectTier,
}: ContractsExpirationDashboardProps) {
  return (
    <section className="contracts-expiration-dashboard" aria-label="Contracts expiration summary">
      <div className="contracts-expiration-dashboard__grid">
        <TierCard
          meta={CRITICAL_META}
          expiryLine={tierExpiryLines.critical}
          count={tierCounts.critical}
          selected={selectedTier === 'critical'}
          onSelect={() => onSelectTier('critical')}
        />
        <TierCard
          meta={WARNING_META}
          expiryLine={tierExpiryLines.warning}
          count={tierCounts.warning}
          selected={selectedTier === 'warning'}
          onSelect={() => onSelectTier('warning')}
        />
        <TierCard
          meta={UPCOMING_META}
          expiryLine={tierExpiryLines.upcoming}
          count={tierCounts.upcoming}
          selected={selectedTier === 'upcoming'}
          onSelect={() => onSelectTier('upcoming')}
        />
      </div>
    </section>
  )
}
