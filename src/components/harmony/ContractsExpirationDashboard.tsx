import clsx from 'clsx'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey = 'critical' | 'warning' | 'upcoming' | 'highFunding'

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

const HIGH_FUNDING_META = {
  tier: 'highFunding' as const,
  windowLabel: 'Funding used > 65%',
}

/** Derived from grid data — null when no contracts exceed the funding threshold. */
export type HighFundingLine = {
  highestPct: number
} | null

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

function HighFundingCard({
  count,
  fundingLine,
  selected,
  onSelect,
}: {
  count: number
  fundingLine: HighFundingLine
  selected: boolean
  onSelect: () => void
}) {
  const headingId = 'ced-high-funding-heading'

  return (
    <article
      className={clsx(
        'ced-card',
        'ced-card--high-funding',
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
          {HIGH_FUNDING_META.windowLabel}
        </p>
        <div className="ced-card__value-stack">
          <p className="ced-card__count" aria-label={`${count} contracts`}>
            {count}
          </p>
          <p className="ced-card__expires-line">
            {fundingLine != null ? (
              <>
                <span className="ced-card__first-expiry-prefix">Highest funding used </span>
                <span className="ced-card__expires-date">{fundingLine.highestPct}%</span>
              </>
            ) : (
              <span className="ced-card__first-expiry-prefix">No contracts above threshold</span>
            )}
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
  highFundingCount: number
  highFundingLine: HighFundingLine
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}

export function ContractsExpirationDashboard({
  tierCounts,
  tierExpiryLines,
  highFundingCount,
  highFundingLine,
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
        <HighFundingCard
          count={highFundingCount}
          fundingLine={highFundingLine}
          selected={selectedTier === 'highFunding'}
          onSelect={() => onSelectTier('highFunding')}
        />
      </div>
    </section>
  )
}
