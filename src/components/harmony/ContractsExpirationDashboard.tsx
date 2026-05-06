import clsx from 'clsx'
import { Tooltip } from './Tooltip'
import './ContractsExpirationDashboard.css'

type ExpiryBarSeg = {
  label: string
  value: number
}

type BudgetRow = {
  id: string
  pct: number
}

type TierCardModel = {
  tier: 'critical' | 'warning' | 'upcoming'
  title: string
  count: number
  subtitle: string
  expiryBars: ExpiryBarSeg[]
  budgetRows: BudgetRow[]
}

const SPEND_PCT_MIN = 65

const CRITICAL_CARD: TierCardModel = {
  tier: 'critical',
  title: 'CRITICAL',
  count: 5,
  subtitle: '≤ 30 days · $530K at risk',
  expiryBars: [
    { label: 'Wk1', value: 1 },
    { label: 'Wk2', value: 1 },
    { label: 'Wk3', value: 1 },
    { label: 'Wk4', value: 2 },
  ],
  budgetRows: [
    { id: 'CTR-2025-002', pct: 35 },
    { id: 'CTR-2025-003', pct: 82 },
    { id: 'CTR-2025-001', pct: 88 },
    { id: 'CTR-2025-006', pct: 45 },
    { id: 'CTR-2025-004', pct: 82 },
  ],
}

const WARNING_CARD: TierCardModel = {
  tier: 'warning',
  title: 'WARNING',
  count: 3,
  subtitle: '31–60 days · $331K at risk',
  expiryBars: [
    { label: 'Wk5–6', value: 2 },
    { label: 'Wk7–8', value: 1 },
  ],
  budgetRows: [
    { id: 'CTR-2025-014', pct: 71 },
    { id: 'CTR-2025-015', pct: 82 },
    { id: 'CTR-2025-018', pct: 28 },
  ],
}

const UPCOMING_CARD: TierCardModel = {
  tier: 'upcoming',
  title: 'UPCOMING',
  count: 3,
  subtitle: '61–90 days · $257K at risk',
  expiryBars: [
    { label: 'Wk9–10', value: 1 },
    { label: 'Wk11–12', value: 2 },
    { label: 'Wk13+', value: 0 },
  ],
  budgetRows: [
    { id: 'CTR-2025-020', pct: 55 },
    { id: 'CTR-2025-021', pct: 92 },
    { id: 'CTR-2025-022', pct: 40 },
  ],
}

function countHighSpendContracts(rows: readonly BudgetRow[]): number {
  return rows.filter((r) => r.pct >= SPEND_PCT_MIN).length
}

function BarTooltipBody({
  seg,
  highSpendCount,
}: {
  seg: ExpiryBarSeg
  highSpendCount: number
}) {
  return (
    <div className="ced-tooltip-kv">
      <div className="ced-tooltip-kv__pair">
        <span className="ced-tooltip-kv__label">Contracts expiring ({seg.label})</span>
        <span className="ced-tooltip-kv__value">{seg.value}</span>
      </div>
      <div className="ced-tooltip-kv__pair">
        <span className="ced-tooltip-kv__label">Spend ≥65% (tier total)</span>
        <span className="ced-tooltip-kv__value">{highSpendCount}</span>
      </div>
    </div>
  )
}

function ExpiryByWeek({ card }: { card: TierCardModel }) {
  const max = Math.max(1, ...card.expiryBars.map((b) => b.value))
  const highSpendCount = countHighSpendContracts(card.budgetRows)

  return (
    <div className="ced-expiry">
      <hr className="ced-expiry__divider" />
      <div className="ced-expiry__bars">
        {card.expiryBars.map((seg) => {
          const barPct = seg.value === 0 ? 0 : (seg.value / max) * 100
          const showEmptyUpcoming = card.tier === 'upcoming' && seg.value === 0
          return (
            <Tooltip
              key={seg.label}
              content={<BarTooltipBody seg={seg} highSpendCount={highSpendCount} />}
              position="top"
              className="ced-expiry__bar-tooltip"
            >
              <div className="ced-expiry__col">
                <div className="ced-expiry__track">
                  <div className="ced-expiry__fill-area">
                    <div
                      className={clsx(
                        'ced-expiry__fill',
                        `ced-expiry__fill--${card.tier}`,
                        showEmptyUpcoming && 'ced-expiry__fill--empty',
                      )}
                      style={{
                        height: showEmptyUpcoming ? '6px' : `${barPct}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="ced-expiry__meta">
                  <span className="ced-expiry__wk">{seg.label}</span>
                </div>
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

function TierCard({ card }: { card: TierCardModel }) {
  return (
    <article className={clsx('ced-card', `ced-card--${card.tier}`)} aria-labelledby={`ced-${card.tier}-title`}>
      <header className="ced-card__head">
        <p className="ced-card__label" id={`ced-${card.tier}-title`}>
          {card.title}
        </p>
        <p className="ced-card__count" aria-label={`${card.count} contracts`}>
          {card.count}
        </p>
        <p className="ced-card__subtitle">{card.subtitle}</p>
      </header>
      <ExpiryByWeek card={card} />
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
