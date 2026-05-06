import clsx from 'clsx'
import './ContractsExpirationDashboard.css'

type TierCardModel = {
  tier: 'critical' | 'warning' | 'upcoming'
  title: string
  count: number
  /** Expiry window for this tier only (no dollar amounts). */
  daysWindow: string
  earliestExpiryValue: string
}

const CRITICAL_CARD: TierCardModel = {
  tier: 'critical',
  title: 'CRITICAL',
  count: 5,
  daysWindow: '≤ 30 days',
  earliestExpiryValue: '5d left',
}

const WARNING_CARD: TierCardModel = {
  tier: 'warning',
  title: 'WARNING',
  count: 3,
  daysWindow: '31–58 days',
  earliestExpiryValue: '12d left',
}

const UPCOMING_CARD: TierCardModel = {
  tier: 'upcoming',
  title: 'UPCOMING',
  count: 3,
  daysWindow: '61–88 days',
  earliestExpiryValue: '45d left',
}

function TierCard({ card }: { card: TierCardModel }) {
  const headingId = `ced-${card.tier}-title`

  return (
    <article
      className={clsx('ced-card', `ced-card--${card.tier}`)}
      aria-labelledby={headingId}
    >
      <header className="ced-card__head">
        <p className="ced-card__label" id={headingId}>
          {card.title}
        </p>
        <p className="ced-card__count" aria-label={`${card.count} contracts`}>
          {card.count}
        </p>
        <p className="ced-card__subtitle">{card.daysWindow}</p>
      </header>

      <hr className="ced-card__divider" aria-hidden />

      <footer className="ced-card__footer">
        <span className="ced-card__footer-label">Earliest expiry</span>
        <span className="ced-card__footer-value" aria-label={`Earliest expiry ${card.earliestExpiryValue}`}>
          {card.earliestExpiryValue}
        </span>
      </footer>
    </article>
  )
}

export function ContractsExpirationDashboard() {
  return (
    <section className="contracts-expiration-dashboard" aria-label="Contracts expiration summary">
      <div className="contracts-expiration-dashboard__grid">
        <TierCard card={CRITICAL_CARD} />
        <TierCard card={WARNING_CARD} />
        <TierCard card={UPCOMING_CARD} />
      </div>
    </section>
  )
}
