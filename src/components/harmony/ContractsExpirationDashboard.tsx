import clsx from 'clsx'
import { useMemo, type ReactNode } from 'react'
import { Card } from './Card'
import { Icon } from './Icon'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey = 'critical' | 'warning' | 'upcoming' | 'highFunding'

export type VizDesignOption = 'option1' | 'option2' | 'option3'

type ExpiryTierKey = 'critical' | 'warning' | 'upcoming'

export const VIZ_DESIGN_OPTIONS = [
  { value: 'option1', label: 'Option 1 - Card Design' },
  { value: 'option2', label: 'Option 2 - Dual Visualization' },
  { value: 'option3', label: 'Option 3 - Timeline & Funding Risk' },
] as const

export function VizDesignOptionPicker({
  value,
  onChange,
  variant = 'default',
}: {
  value: VizDesignOption
  onChange: (value: VizDesignOption) => void
  variant?: 'default' | 'header'
}) {
  return (
    <div className={clsx('ced-viz-design-picker', variant === 'header' && 'ced-viz-design-picker--header')}>
      <label className="ced-viz-design-picker__label" htmlFor="ced-design-option-select">
        View
      </label>
      <select
        id="ced-design-option-select"
        className="select ced-viz-design-picker__select"
        value={value}
        aria-label="Visualization design option"
        onChange={(e) => onChange(e.target.value as VizDesignOption)}
      >
        {VIZ_DESIGN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

const FUNDING_TIER_META = [
  {
    key: 'critical' as const,
    label: '90%+ of funding used',
    shortLabel: '90%+ used',
    colorVar: 'var(--data-viz-critical)',
    cssMod: 'critical',
  },
  {
    key: 'elevated' as const,
    label: '80–89% of funding used',
    shortLabel: '80–89% used',
    colorVar: 'var(--data-viz-warning)',
    cssMod: 'elevated',
  },
  {
    key: 'normal' as const,
    label: '65–79% of funding used',
    shortLabel: '65–79% used',
    colorVar: 'var(--color-info, #2563eb)',
    cssMod: 'normal',
  },
] as const

/** Derived from grid data — null when no contracts in tier within the 90-day window. */
export type TierExpiryLine = {
  firstExpiresDate: string
  daysUntilShort: string
} | null

/** Derived from grid data — null when no contracts exceed the funding threshold. */
export type HighFundingLine = {
  highestPct: number
  vendorName: string
} | null

export type FundingUtilizationSummary = {
  aboveThresholdCount: number
  totalInWindow: number
  tiers: { critical: number; elevated: number; normal: number }
  belowThresholdCount: number
}

export type ContractsExpirationDashboardProps = {
  designOption: VizDesignOption
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierExpiryLines: {
    critical: TierExpiryLine
    warning: TierExpiryLine
    upcoming: TierExpiryLine
  }
  highFundingCount: number
  highFundingLine: HighFundingLine
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}

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

function OriginalTierCard({
  meta,
  expiryLine,
  count,
  selected,
  onSelect,
}: {
  meta: { tier: ExpiryTierKey; windowLabel: string }
  expiryLine: TierExpiryLine
  count: number
  selected: boolean
  onSelect: () => void
}) {
  const headingId = `ced-${meta.tier}-heading`

  return (
    <article
      className={clsx(
        'ced-card',
        `ced-card--${meta.tier}`,
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
          {meta.windowLabel}
        </p>
        <div className="ced-card__value-stack">
          <p className="ced-card__count" aria-label={`${count} contracts`}>
            {count}
          </p>
          <p className="ced-card__expires-line">
            <span className="ced-card__first-expiry-prefix">First expiry </span>
            <span className="ced-card__expires-date">{expiryLine?.firstExpiresDate ?? '—'}</span>
            {expiryLine?.daysUntilShort ? (
              <span className="ced-card__expires-paren"> ({expiryLine.daysUntilShort})</span>
            ) : null}
          </p>
        </div>
      </div>
    </article>
  )
}

function OriginalHighFundingCard({
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
          Funding used &gt; 65%
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

function ExpiryTierCards({
  tierCounts,
  tierExpiryLines,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierExpiryLines: {
    critical: TierExpiryLine
    warning: TierExpiryLine
    upcoming: TierExpiryLine
  }
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpiryTierKey) => void
}) {
  return (
    <>
      <OriginalTierCard
        meta={CRITICAL_META}
        expiryLine={tierExpiryLines.critical}
        count={tierCounts.critical}
        selected={selectedTier === 'critical'}
        onSelect={() => onSelectTier('critical')}
      />
      <OriginalTierCard
        meta={WARNING_META}
        expiryLine={tierExpiryLines.warning}
        count={tierCounts.warning}
        selected={selectedTier === 'warning'}
        onSelect={() => onSelectTier('warning')}
      />
      <OriginalTierCard
        meta={UPCOMING_META}
        expiryLine={tierExpiryLines.upcoming}
        count={tierCounts.upcoming}
        selected={selectedTier === 'upcoming'}
        onSelect={() => onSelectTier('upcoming')}
      />
    </>
  )
}

function OriginalKpiStrip({
  tierCounts,
  tierExpiryLines,
  highFundingCount,
  highFundingLine,
  selectedTier,
  onSelectTier,
}: {
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
}) {
  return (
    <div className="contracts-expiration-dashboard__grid">
      <ExpiryTierCards
        tierCounts={tierCounts}
        tierExpiryLines={tierExpiryLines}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
      />
      <OriginalHighFundingCard
        count={highFundingCount}
        fundingLine={highFundingLine}
        selected={selectedTier === 'highFunding'}
        onSelect={() => onSelectTier('highFunding')}
      />
    </div>
  )
}

function VizPanelCard({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <Card className="ced-viz-panel" elevated withHeader headerTitle={title} headerSubtitle={hint}>
      {children}
    </Card>
  )
}

function DonutChart({
  segments,
  ariaLabel,
  className,
  centerLabel,
  centerSublabel,
}: {
  segments: { count: number; color: string; key: string }[]
  ariaLabel: string
  className?: string
  centerLabel?: string
  centerSublabel?: string
}) {
  const total = segments.reduce((sum, seg) => sum + seg.count, 0)
  const size = 140
  const stroke = 22
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  let arcs: ReactNode[] = []
  if (total > 0) {
    let offset = 0
    arcs = segments
      .filter((seg) => seg.count > 0)
      .map((seg) => {
        const fraction = seg.count / total
        const dash = fraction * circumference
        const arc = (
          <circle
            key={seg.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )
        offset += dash
        return arc
      })
  }

  return (
    <div className="ced-donut-chart">
      <svg
        className={clsx('ced-donut', className)}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        {total === 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={stroke}
          />
        ) : (
          arcs
        )}
      </svg>
      {(centerLabel != null || centerSublabel != null) && (
        <div className="ced-donut-chart__center" aria-hidden>
          {centerLabel != null ? <span className="ced-donut-chart__center-value">{centerLabel}</span> : null}
          {centerSublabel != null ? (
            <span className="ced-donut-chart__center-label">{centerSublabel}</span>
          ) : null}
        </div>
      )}
    </div>
  )
}

function FundingUtilizationPanel({
  summary,
  selectedTier,
  onSelectTier,
}: {
  summary: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}) {
  const fundingSelected = selectedTier === 'highFunding'
  const { aboveThresholdCount, belowThresholdCount, totalInWindow } = summary

  const donutSegments = [
    {
      key: 'above',
      count: aboveThresholdCount,
      color: 'var(--data-viz-warning)',
    },
    {
      key: 'below',
      count: belowThresholdCount,
      color: 'var(--theme-primary, #1e3a5f)',
    },
  ]

  const aboveTierBreakdown = FUNDING_TIER_META.map((meta) => ({
    ...meta,
    count: summary.tiers[meta.key],
  })).filter((tier) => tier.count > 0)

  const activateFundingFilter = () => onSelectTier('highFunding')

  return (
    <div
      className={clsx('ced-funding-viz', fundingSelected && 'ced-funding-viz--selected')}
      role="button"
      tabIndex={0}
      aria-pressed={fundingSelected}
      aria-label={`${aboveThresholdCount} of ${totalInWindow} contracts have used 65% or more of funding. Click to filter roster.`}
      onClick={activateFundingFilter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activateFundingFilter()
        }
      }}
    >
      <div className="ced-funding-viz__donut-wrap">
        <DonutChart
          segments={donutSegments}
          centerLabel={`${aboveThresholdCount}/${totalInWindow}`}
          centerSublabel="≥65% used"
          ariaLabel={`${aboveThresholdCount} of ${totalInWindow} contracts have used 65% or more of funding; ${belowThresholdCount} are below that level`}
        />
      </div>
      <div className="ced-funding-viz__stats">
        <div className="ced-funding-viz__headline">
          <p className="ced-funding-viz__headline-title">
            {aboveThresholdCount} contract{aboveThresholdCount === 1 ? '' : 's'} need funding review
          </p>
          <p className="ced-funding-viz__headline-detail">
            These contracts have used <strong>65% or more</strong> of their funded amount (ITD cost ÷
            funded value).
          </p>
        </div>
        <ul className="ced-funding-viz__legend" aria-label="Funding utilization breakdown">
          <li className="ced-funding-viz__legend-item">
            <span className="ced-funding-viz__legend-swatch ced-funding-viz__legend-swatch--above" aria-hidden />
            <span className="ced-funding-viz__legend-text">
              <strong>{aboveThresholdCount}</strong> at or above 65% funding used
              {fundingSelected ? ' — filtering roster' : ' — click to filter roster'}
            </span>
          </li>
          <li className="ced-funding-viz__legend-item">
            <span className="ced-funding-viz__legend-swatch ced-funding-viz__legend-swatch--below" aria-hidden />
            <span className="ced-funding-viz__legend-text">
              <strong>{belowThresholdCount}</strong> below 65% — within budget
            </span>
          </li>
        </ul>
        {aboveTierBreakdown.length > 0 ? (
          <div className="ced-funding-viz__subbreakdown">
            <p className="ced-funding-viz__subbreakdown-title">Of the {aboveThresholdCount} above 65%:</p>
            <ul className="ced-funding-viz__subbreakdown-list">
              {aboveTierBreakdown.map((tier) => (
                <li key={tier.key} className="ced-funding-viz__subbreakdown-item">
                  <span
                    className={clsx(
                      'ced-funding-viz__legend-swatch',
                      `ced-funding-viz__legend-swatch--${tier.cssMod}`,
                    )}
                    aria-hidden
                  />
                  <span>
                    <strong>{tier.count}</strong> at {tier.shortLabel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const O3_EXPIRY_TIER_META = [
  {
    tier: 'critical' as const,
    label: '0–30 days',
  },
  {
    tier: 'warning' as const,
    label: '31–60 days',
  },
  {
    tier: 'upcoming' as const,
    label: '61–90 days',
  },
] as const

function miniVizBarHeights(tier: ExpiryTierKey, count: number): number[] {
  const barCount = Math.min(Math.max(count, 1), 7)
  if (tier === 'critical') {
    return Array.from({ length: barCount }, () => 55)
  }
  if (tier === 'warning') {
    const pattern = [38, 62, 48, 72, 55, 68, 44]
    return Array.from({ length: barCount }, (_, i) => pattern[i % pattern.length])
  }
  const pattern = [52, 68]
  return Array.from({ length: Math.min(barCount, 2) }, (_, i) => pattern[i % pattern.length])
}

function MiniTierViz({ tier, count }: { tier: ExpiryTierKey; count: number }) {
  const heights = useMemo(() => miniVizBarHeights(tier, count), [tier, count])
  if (count === 0) return <div className="ced-o3-mini-viz ced-o3-mini-viz--empty" aria-hidden />

  return (
    <div className={clsx('ced-o3-mini-viz', `ced-o3-mini-viz--${tier}`)} aria-hidden>
      {heights.map((height, index) => (
        <span
          key={`${tier}-${index}`}
          className="ced-o3-mini-viz__bar"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

function ExpiringByDaysCard({
  meta,
  count,
  selected,
  onSelect,
}: {
  meta: (typeof O3_EXPIRY_TIER_META)[number]
  count: number
  selected: boolean
  onSelect: () => void
}) {
  const headingId = `ced-o3-${meta.tier}-heading`

  return (
    <article
      className={clsx(
        'ced-o3-expiry-card',
        `ced-o3-expiry-card--${meta.tier}`,
        selected && 'ced-o3-expiry-card--selected',
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
      <div className="ced-o3-expiry-card__body">
        <div className="ced-o3-expiry-card__top">
          <Icon name="chevron-right" size="xs" className="ced-o3-expiry-card__chevron" aria-hidden />
        </div>
        <p className="ced-o3-expiry-card__count" aria-label={`${count} contracts`}>
          {count}
        </p>
        <p className="ced-o3-expiry-card__label" id={headingId}>
          {meta.label}
        </p>
        <MiniTierViz tier={meta.tier} count={count} />
      </div>
    </article>
  )
}

function ExpiringByDaysPanel({
  tierCounts,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpiryTierKey) => void
}) {
  return (
    <section className="ced-o3-panel ced-o3-expiring-panel" aria-label="Expiring by days remaining">
      <h2 className="ced-o3-panel__title">Expiring — by days remaining</h2>
      <div className="ced-o3-expiring-panel__cards" role="group" aria-label="Expiration windows">
        {O3_EXPIRY_TIER_META.map((meta) => (
          <ExpiringByDaysCard
            key={meta.tier}
            meta={meta}
            count={tierCounts[meta.tier]}
            selected={selectedTier === meta.tier}
            onSelect={() => onSelectTier(meta.tier)}
          />
        ))}
      </div>
    </section>
  )
}

function ProgressRing({
  pct,
  color,
  size = 44,
  stroke = 5,
  ariaLabel,
  centerLabel,
}: {
  pct: number
  color: string
  size?: number
  stroke?: number
  ariaLabel: string
  centerLabel?: string
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, pct))
  const dash = (clamped / 100) * circumference

  return (
    <div className="ced-o3-progress-ring-wrap">
      <svg
        className="ced-o3-progress-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {centerLabel != null ? (
        <span className="ced-o3-progress-ring__center" aria-hidden>
          {centerLabel}
        </span>
      ) : null}
    </div>
  )
}

function FundingRiskCard({
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
  const highestPct = fundingLine?.highestPct ?? 0
  const vendorName = fundingLine?.vendorName ?? '—'

  return (
    <article
      className={clsx('ced-o3-funding-card', selected && 'ced-o3-funding-card--selected')}
      aria-label={`Funding risk: ${count} contracts above 65% funding used`}
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
      <div className="ced-o3-funding-card__body">
        <div className="ced-o3-funding-card__top">
          <Icon name="chevron-right" size="xs" className="ced-o3-funding-card__chevron" aria-hidden />
        </div>
        <div className="ced-o3-funding-card__main">
          <div className="ced-o3-funding-card__metric">
            <p className="ced-o3-funding-card__count">{count}</p>
            <p className="ced-o3-funding-card__label">Funding used &gt; 65%</p>
          </div>
        </div>
        {fundingLine != null ? (
          <footer className="ced-o3-funding-card__footer">
            <ProgressRing
              pct={highestPct}
              color="var(--ced-o3-funding)"
              centerLabel={`${highestPct}%`}
              ariaLabel={`Highest funding used ${highestPct} percent`}
            />
            <div className="ced-o3-funding-card__footer-text">
              <p className="ced-o3-funding-card__highest">Highest {highestPct}%</p>
              <p className="ced-o3-funding-card__vendor">{vendorName}</p>
            </div>
          </footer>
        ) : null}
      </div>
    </article>
  )
}

function FundingRiskPanel({
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
  return (
    <section className="ced-o3-panel ced-o3-funding-panel" aria-label="Funding risk">
      <h2 className="ced-o3-panel__title">Funding risk</h2>
      <FundingRiskCard
        count={count}
        fundingLine={fundingLine}
        selected={selected}
        onSelect={onSelect}
      />
    </section>
  )
}

function Option3Visualization({
  tierCounts,
  highFundingCount,
  highFundingLine,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  highFundingCount: number
  highFundingLine: HighFundingLine
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}) {
  const handleExpirySelect = (tier: ExpiryTierKey) => {
    onSelectTier(tier)
  }

  return (
    <div className="ced-o3-row">
      <ExpiringByDaysPanel
        tierCounts={tierCounts}
        selectedTier={selectedTier}
        onSelectTier={handleExpirySelect}
      />
      <FundingRiskPanel
        count={highFundingCount}
        fundingLine={highFundingLine}
        selected={selectedTier === 'highFunding'}
        onSelect={() => onSelectTier('highFunding')}
      />
    </div>
  )
}

export function ContractsExpirationDashboard({
  designOption,
  tierCounts,
  tierExpiryLines,
  highFundingCount,
  highFundingLine,
  fundingUtilization,
  selectedTier,
  onSelectTier,
}: ContractsExpirationDashboardProps) {
  const handleExpirySelect = (tier: ExpiryTierKey) => {
    onSelectTier(tier)
  }

  if (designOption === 'option1') {
    return (
      <section className="contracts-expiration-dashboard ced-layout-option1" aria-label="Contracts expiration summary">
        <OriginalKpiStrip
          tierCounts={tierCounts}
          tierExpiryLines={tierExpiryLines}
          highFundingCount={highFundingCount}
          highFundingLine={highFundingLine}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
        />
      </section>
    )
  }

  if (designOption === 'option3') {
    return (
      <section className="contracts-expiration-dashboard ced-layout-option3" aria-label="Command center timeline and funding risk">
        <Option3Visualization
          tierCounts={tierCounts}
          highFundingCount={highFundingCount}
          highFundingLine={highFundingLine}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
        />
      </section>
    )
  }

  return (
    <section className="contracts-expiration-dashboard ced-layout-option2" aria-label="Command center visualizations">
      <div className="ced-dual-viz-grid">
        <VizPanelCard
          title="Contract Expiration Timeline"
          hint="Click a window to filter the roster below."
        >
          <div
            className="contracts-expiration-dashboard__grid contracts-expiration-dashboard__grid--expiry-tiers"
            role="group"
            aria-label="Expiration tier KPI cards"
          >
            <ExpiryTierCards
              tierCounts={tierCounts}
              tierExpiryLines={tierExpiryLines}
              selectedTier={selectedTier}
              onSelectTier={handleExpirySelect}
            />
          </div>
        </VizPanelCard>

        <VizPanelCard
          title="Funding Utilization"
          hint="Contracts where ITD cost has reached 65% of funded value. Click to filter the roster."
        >
          <FundingUtilizationPanel
            summary={fundingUtilization}
            selectedTier={selectedTier}
            onSelectTier={onSelectTier}
          />
        </VizPanelCard>
      </div>
    </section>
  )
}
