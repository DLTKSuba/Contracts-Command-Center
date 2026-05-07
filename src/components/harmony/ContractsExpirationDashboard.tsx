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
  /** Days-in-parentheses suffix, e.g. "5d" → rendered as "(5d)". */
  daysUntilShort: string
}

const CRITICAL_META = {
  tier: 'critical' as const,
  windowLabel: 'Expires within 30 days',
  firstExpiresDate: 'Mar 31, 2026',
  daysUntilShort: '5d',
}

const WARNING_META = {
  tier: 'warning' as const,
  windowLabel: 'Expires in 31–60 days',
  firstExpiresDate: 'May 3, 2026',
  daysUntilShort: '38d',
}

const UPCOMING_META = {
  tier: 'upcoming' as const,
  windowLabel: 'Expires in 61–90 days',
  firstExpiresDate: 'May 30, 2026',
  daysUntilShort: '65d',
}

function TierCard({
  meta,
  count,
  selected,
  onSelect,
}: {
  meta: Omit<TierCardModel, 'count'>
  count: number
  selected: boolean
  onSelect: () => void
}) {
  const headingId = `ced-${meta.tier}-heading`
  const card: TierCardModel = { ...meta, count }

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
            <span className="ced-card__expires-paren"> ({card.daysUntilShort})</span>
          </p>
        </div>
      </div>
    </article>
  )
}

export type ContractsExpirationDashboardProps = {
  tierCounts: { critical: number; warning: number; upcoming: number }
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}

export function ContractsExpirationDashboard({
  tierCounts,
  selectedTier,
  onSelectTier,
}: ContractsExpirationDashboardProps) {
  return (
    <section className="contracts-expiration-dashboard" aria-label="Contracts expiration summary">
      <div className="contracts-expiration-dashboard__grid">
        <TierCard
          meta={CRITICAL_META}
          count={tierCounts.critical}
          selected={selectedTier === 'critical'}
          onSelect={() => onSelectTier('critical')}
        />
        <TierCard
          meta={WARNING_META}
          count={tierCounts.warning}
          selected={selectedTier === 'warning'}
          onSelect={() => onSelectTier('warning')}
        />
        <TierCard
          meta={UPCOMING_META}
          count={tierCounts.upcoming}
          selected={selectedTier === 'upcoming'}
          onSelect={() => onSelectTier('upcoming')}
        />
      </div>
    </section>
  )
}
