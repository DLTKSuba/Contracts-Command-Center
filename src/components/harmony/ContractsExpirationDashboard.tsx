import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Card } from './Card'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey = 'critical' | 'warning' | 'upcoming' | 'highFunding'

export type VizDesignOption = 'option1' | 'option2'

type ExpiryTierKey = 'critical' | 'warning' | 'upcoming'

export const VIZ_DESIGN_OPTIONS = [
  { value: 'option1', label: 'Option 1 - Card Design' },
  { value: 'option2', label: 'Option 2 - Dual Visualization' },
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
    label: '≥ 90% Critical',
    colorVar: 'var(--data-viz-critical)',
    cssMod: 'critical',
  },
  {
    key: 'elevated' as const,
    label: '80-89% Elevated',
    colorVar: 'var(--data-viz-warning)',
    cssMod: 'elevated',
  },
  {
    key: 'normal' as const,
    label: '65-79% Normal',
    colorVar: 'var(--color-info, #2563eb)',
    cssMod: 'normal',
  },
]

/** Derived from grid data — null when no contracts in tier within the 90-day window. */
export type TierExpiryLine = {
  firstExpiresDate: string
  daysUntilShort: string
} | null

/** Derived from grid data — null when no contracts exceed the funding threshold. */
export type HighFundingLine = {
  highestPct: number
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
}: {
  segments: { count: number; color: string; key: string }[]
  ariaLabel: string
  className?: string
}) {
  const total = segments.reduce((sum, seg) => sum + seg.count, 0)
  const size = 140
  const stroke = 22
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  if (total === 0) {
    return (
      <svg
        className={clsx('ced-donut', className)}
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
      </svg>
    )
  }

  let offset = 0
  const arcs = segments
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

  return (
    <svg
      className={clsx('ced-donut', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
    >
      {arcs}
    </svg>
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
  const tierCounts = [
    summary.tiers.critical,
    summary.tiers.elevated,
    summary.tiers.normal,
    summary.belowThresholdCount,
  ]
  const maxCount = Math.max(...tierCounts, 1)
  const fundingSelected = selectedTier === 'highFunding'

  const donutSegments = [
    ...FUNDING_TIER_META.map((meta) => ({
      key: meta.key,
      count: summary.tiers[meta.key],
      color: meta.colorVar,
    })),
    {
      key: 'below',
      count: summary.belowThresholdCount,
      color: 'var(--theme-primary, #1e3a5f)',
    },
  ]

  return (
    <div className="ced-funding-viz">
      <div className="ced-funding-viz__donut-wrap">
        <DonutChart
          segments={donutSegments}
          ariaLabel={`Funding utilization: ${summary.aboveThresholdCount} of ${summary.totalInWindow} contracts above 65%`}
        />
      </div>
      <div className="ced-funding-viz__stats">
        <div className="ced-funding-viz__headline">
          <span className="ced-funding-viz__total">{summary.aboveThresholdCount}</span>
          <span className="ced-funding-viz__context">
            of {summary.totalInWindow} contracts above 65%
          </span>
        </div>
        <div className="ced-funding-viz__tier-list" role="group" aria-label="Funding tier breakdown">
          {FUNDING_TIER_META.map((meta) => {
            const count = summary.tiers[meta.key]
            const barPct = Math.round((count / maxCount) * 100)
            return (
              <button
                key={meta.key}
                type="button"
                className={clsx(
                  'ced-funding-viz__tier-row',
                  `ced-funding-viz__tier-row--${meta.cssMod}`,
                  fundingSelected && 'ced-funding-viz__tier-row--selected',
                )}
                aria-pressed={fundingSelected}
                onClick={() => onSelectTier('highFunding')}
              >
                <span className="ced-funding-viz__tier-swatch" aria-hidden />
                <span className="ced-funding-viz__tier-label">{meta.label}</span>
                <span className="ced-funding-viz__tier-track" aria-hidden>
                  <span
                    className="ced-funding-viz__tier-fill"
                    style={{ width: `${barPct}%`, backgroundColor: meta.colorVar }}
                  />
                </span>
                <span className="ced-funding-viz__tier-count">{count}</span>
              </button>
            )
          })}
        </div>
        {summary.belowThresholdCount > 0 ? (
          <p className="ced-funding-viz__footer">
            <span className="ced-funding-viz__footer-swatch" aria-hidden />
            {summary.belowThresholdCount} contract
            {summary.belowThresholdCount === 1 ? '' : 's'} below 65% threshold
          </p>
        ) : null}
      </div>
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
          title="Funding Utilization ≥ 65%"
          hint="Click a segment or tier to filter the roster below."
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
