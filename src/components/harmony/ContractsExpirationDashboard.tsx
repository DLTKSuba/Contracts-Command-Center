import clsx from 'clsx'
import { useMemo, type ReactNode } from 'react'
import { Card } from './Card'
import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey =
  | 'critical'
  | 'warning'
  | 'upcoming'
  | 'highFunding'
  | 'fundLow'
  | 'fundMid'
  | 'fundHigh'

export type VizDesignOption = 'option1' | 'option2' | 'option3' | 'option4'

type ExpiryTierKey = 'critical' | 'warning' | 'upcoming'

export const VIZ_DESIGN_OPTIONS = [
  { value: 'option1', label: 'Option 1 - Card Design' },
  { value: 'option2', label: 'Option 2 - Dual Visualization' },
  { value: 'option3', label: 'Option 3 - Timeline & Funding Risk' },
  { value: 'option4', label: 'Option 4 - Pie Chart' },
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

/** One contract represented by a mini histogram bar in Option 3. */
export type ExpiryTierContract = {
  name: string
  expirationDate: string
  /** Days until this contract expires (used to position the histogram bar on the axis). */
  daysRemaining: number
}

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
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  }
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
          Funding used 65% or more
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

type ExpiryDayBin = { min: number; max: number }

function ExpiryBarTooltipContent({ contracts }: { contracts: ExpiryTierContract[] }) {
  return (
    <div className="ced-o3-bar-tooltip">
      {contracts.map((contract, index) => (
        <div
          key={`${contract.name}-${contract.expirationDate}-${index}`}
          className={clsx('ced-o3-bar-tooltip__contract', index > 0 && 'ced-o3-bar-tooltip__contract--sep')}
        >
          <div className="ced-o3-bar-tooltip__row">
            <span>Name: {contract.name}</span>
          </div>
          <div className="ced-o3-bar-tooltip__row">
            <span>Expiration date: {contract.expirationDate}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatExpiryBinLabel(bin: ExpiryDayBin): string {
  return `${bin.min}-${bin.max}`
}

/** Six bins per tier: first spans 6 days, then five 5-day bins (same pattern as 0–30). */
function getExpiryTierBins(tier: ExpiryTierKey): ExpiryDayBin[] {
  const tierStart = tier === 'critical' ? 0 : tier === 'warning' ? 31 : 61
  return [
    { min: tierStart, max: tierStart + 5 },
    { min: tierStart + 6, max: tierStart + 10 },
    { min: tierStart + 11, max: tierStart + 15 },
    { min: tierStart + 16, max: tierStart + 20 },
    { min: tierStart + 21, max: tierStart + 25 },
    { min: tierStart + 26, max: tierStart + 30 },
  ]
}

function binIndexForDay(day: number, bins: ExpiryDayBin[]): number {
  return bins.findIndex((bin) => day >= bin.min && day <= bin.max)
}

function groupContractsByBin(contracts: ExpiryTierContract[], bins: ExpiryDayBin[]) {
  return bins.map((bin, index) => {
    const inBin = contracts.filter((c) => binIndexForDay(c.daysRemaining, bins) === index)
    return { index, bin, contracts: inBin, count: inBin.length }
  })
}

const O3_BIN_BAR_DEFAULT_PCT = 50
const O3_BIN_BAR_PEAK_PCT = 100

/** Default height for empty bins and single-contract bins; taller only when count > 1 in a bin. */
function expiryBinBarHeightPercent(binCount: number, maxBinCount: number): number {
  if (binCount <= 1) return O3_BIN_BAR_DEFAULT_PCT
  if (maxBinCount <= 1) return O3_BIN_BAR_DEFAULT_PCT
  return (
    O3_BIN_BAR_DEFAULT_PCT +
    ((binCount - 1) / (maxBinCount - 1)) * (O3_BIN_BAR_PEAK_PCT - O3_BIN_BAR_DEFAULT_PCT)
  )
}

function MiniTierViz({
  tier,
  count,
  contracts,
}: {
  tier: ExpiryTierKey
  count: number
  contracts: ExpiryTierContract[]
}) {
  const bins = useMemo(() => getExpiryTierBins(tier), [tier])
  const grouped = useMemo(() => groupContractsByBin(contracts, bins), [contracts, bins])
  const maxBinCount = useMemo(
    () => Math.max(1, ...grouped.map((g) => g.count)),
    [grouped],
  )

  if (count === 0) return <div className="ced-o3-mini-viz ced-o3-mini-viz--empty" aria-hidden />

  const rangeMin = bins[0].min
  const rangeMax = bins[bins.length - 1].max

  return (
    <div
      className={clsx('ced-o3-mini-viz', `ced-o3-mini-viz--${tier}`)}
      role="group"
      aria-label={`${count} contracts, expiring between ${rangeMin} and ${rangeMax} days`}
    >
      <div className="ced-o3-mini-viz__plot">
        {grouped.map(({ index, bin, contracts: binContracts, count: binCount }) => {
          const barHeight = expiryBinBarHeightPercent(binCount, maxBinCount)
          const emptyBarHeight = expiryBinBarHeightPercent(0, maxBinCount)

          return (
            <div key={`${tier}-bin-${index}`} className="ced-o3-mini-viz__bin-column">
              <div className="ced-o3-mini-viz__bin-slot">
                {binCount > 0 ? (
                  <Tooltip
                    position="top"
                    className="ced-o3-mini-viz__bar-tooltip"
                    content={<ExpiryBarTooltipContent contracts={binContracts} />}
                  >
                    <span
                      className="ced-o3-mini-viz__bar-hit"
                      role="img"
                      aria-label={`${binCount} ${binCount === 1 ? 'contract' : 'contracts'}, days ${bin.min}-${bin.max}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="ced-o3-mini-viz__bar"
                        style={{ height: `${barHeight}%` }}
                        aria-hidden
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip
                    position="top"
                    className="ced-o3-mini-viz__bar-tooltip"
                    text="No contracts expiring"
                  >
                    <span
                      className="ced-o3-mini-viz__bar-hit ced-o3-mini-viz__bar-hit--empty"
                      role="img"
                      aria-label={`No contracts expiring, days ${bin.min}-${bin.max}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="ced-o3-mini-viz__bar ced-o3-mini-viz__bar--empty"
                        style={{ height: `${emptyBarHeight}%` }}
                        aria-hidden
                      />
                    </span>
                  </Tooltip>
                )}
              </div>
              <span className="ced-o3-mini-viz__axis-label">{formatExpiryBinLabel(bin)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExpiringByDaysCard({
  meta,
  count,
  contracts,
  selected,
  onSelect,
}: {
  meta: (typeof O3_EXPIRY_TIER_META)[number]
  count: number
  contracts: ExpiryTierContract[]
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
        <MiniTierViz tier={meta.tier} count={count} contracts={contracts} />
      </div>
    </article>
  )
}

function ExpiringByDaysPanel({
  tierCounts,
  tierContracts,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  }
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
            contracts={tierContracts[meta.tier]}
            selected={selectedTier === meta.tier}
            onSelect={() => onSelectTier(meta.tier)}
          />
        ))}
      </div>
    </section>
  )
}

const FUNDING_RISK_RING_SEGMENTS = [
  {
    key: 'normal',
    label: '65–79%',
    color: 'var(--ced-o3-funding)',
    countFrom: (summary: FundingUtilizationSummary) => summary.tiers.normal,
  },
  {
    key: 'elevated',
    label: '80–89%',
    color: 'var(--data-viz-warning)',
    countFrom: (summary: FundingUtilizationSummary) => summary.tiers.elevated,
  },
  {
    key: 'critical',
    label: '90%+',
    color: 'var(--data-viz-critical)',
    countFrom: (summary: FundingUtilizationSummary) => summary.tiers.critical,
  },
] as const

function FundingRiskTierRing({
  summary,
  highestPct,
  size = 44,
}: {
  summary: FundingUtilizationSummary
  highestPct: number
  size?: number
}) {
  const stroke = 5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = summary.aboveThresholdCount
  const segments = FUNDING_RISK_RING_SEGMENTS.map((meta) => ({
    ...meta,
    count: meta.countFrom(summary),
  })).filter((segment) => segment.count > 0)

  const ariaParts = segments.map((segment) => `${segment.count} at ${segment.label}`)
  const ariaLabel =
    total === 0
      ? 'No contracts at or above 65% funding used'
      : `Highest funding used ${highestPct} percent; ${ariaParts.join(', ')}`

  let offset = 0
  const arcs =
    total > 0
      ? segments.map((segment) => {
          const dash = (segment.count / total) * circumference
          const arc = (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
          offset += dash
          return arc
        })
      : []

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
        {arcs}
      </svg>
      <span className="ced-o3-progress-ring__center" aria-hidden>
        {highestPct}%
      </span>
    </div>
  )
}

function FundingRiskCard({
  count,
  fundingLine,
  fundingUtilization,
  selected,
  onSelect,
  layout = 'default',
}: {
  count: number
  fundingLine: HighFundingLine
  fundingUtilization: FundingUtilizationSummary
  selected: boolean
  onSelect: () => void
  layout?: 'default' | 'option4'
}) {
  const highestPct = fundingLine?.highestPct ?? 0
  const vendorName = fundingLine?.vendorName ?? '—'
  const isOption4 = layout === 'option4'
  const ringSize = isOption4 ? 88 : 44

  const legendSegments = FUNDING_RISK_RING_SEGMENTS.filter(
    (segment) => segment.countFrom(fundingUtilization) > 0,
  )

  const legend = fundingLine != null ? (
    <ul className="ced-o3-funding-card__legend" aria-label="Funding tier colors">
      {legendSegments.map((segment) => (
        <li key={segment.key} className="ced-o3-funding-card__legend-item">
          <span
            className="ced-o3-funding-card__legend-bullet"
            style={{ backgroundColor: segment.color }}
            aria-hidden
          />
          <span className="ced-o3-funding-card__legend-label">{segment.label}</span>
        </li>
      ))}
    </ul>
  ) : null

  const option4Legend = fundingLine != null ? (
    <ul
      className="ced-o3-funding-card__legend ced-o3-funding-card__legend--horizontal"
      aria-label="Funding tier colors"
    >
      {FUNDING_RISK_RING_SEGMENTS.filter(
        (segment) => segment.key === 'elevated' || segment.key === 'critical',
      )
        .filter((segment) => segment.countFrom(fundingUtilization) > 0)
        .map((segment) => (
          <li key={segment.key} className="ced-o3-funding-card__legend-item">
            <span
              className="ced-o3-funding-card__legend-bullet"
              style={{ backgroundColor: segment.color }}
              aria-hidden
            />
            <span className="ced-o3-funding-card__legend-label">{segment.label}</span>
          </li>
        ))}
    </ul>
  ) : null

  const details = fundingLine != null ? (
    <div className="ced-o3-funding-card__details">
      <p className="ced-o3-funding-card__highest">Highest {highestPct}%</p>
      {legend}
      <p className="ced-o3-funding-card__vendor">{vendorName}</p>
    </div>
  ) : null

  const option4Details = fundingLine != null ? (
    <div className="ced-o3-funding-card__details ced-o3-funding-card__details--option4">
      {option4Legend}
      <div className="ced-o3-funding-card__details-divider" role="presentation" />
      <p className="ced-o3-funding-card__highest">Highest {highestPct}%</p>
      <p className="ced-o3-funding-card__vendor">{vendorName}</p>
    </div>
  ) : null

  return (
    <article
      className={clsx(
        'ced-o3-funding-card',
        isOption4 && 'ced-o3-funding-card--option4',
        selected && 'ced-o3-funding-card--selected',
      )}
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
            <p className="ced-o3-funding-card__label">Funding used 65% or more</p>
          </div>
        </div>
        {fundingLine != null && isOption4 ? (
          <div className="ced-o3-funding-card__viz-stack">
            <div className="ced-o3-funding-card__viz-center">
              <FundingRiskTierRing
                summary={fundingUtilization}
                highestPct={highestPct}
                size={ringSize}
              />
            </div>
            {option4Details}
          </div>
        ) : null}
        {fundingLine != null && !isOption4 ? (
          <footer className="ced-o3-funding-card__footer">
            <FundingRiskTierRing
              summary={fundingUtilization}
              highestPct={highestPct}
              size={ringSize}
            />
            <div className="ced-o3-funding-card__footer-text">{details}</div>
          </footer>
        ) : null}
      </div>
    </article>
  )
}

function FundingRiskPanel({
  count,
  fundingLine,
  fundingUtilization,
  selected,
  onSelect,
  layout = 'default',
}: {
  count: number
  fundingLine: HighFundingLine
  fundingUtilization: FundingUtilizationSummary
  selected: boolean
  onSelect: () => void
  layout?: 'default' | 'option4'
}) {
  if (layout === 'option4') {
    return (
      <section className="ced-o4-panel ced-o4-funding-panel" aria-label="Funding risk">
        <div className="ced-o4-panel__head">
          <h2 className="ced-o4-panel__title">Funding risk</h2>
        </div>
        <div className="ced-o4-panel__viz">
          <FundingRiskCard
            count={count}
            fundingLine={fundingLine}
            fundingUtilization={fundingUtilization}
            selected={selected}
            onSelect={onSelect}
            layout="option4"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="ced-o3-panel ced-o3-funding-panel" aria-label="Funding risk">
      <h2 className="ced-o3-panel__title">Funding risk</h2>
      <FundingRiskCard
        count={count}
        fundingLine={fundingLine}
        fundingUtilization={fundingUtilization}
        selected={selected}
        onSelect={onSelect}
      />
    </section>
  )
}

function Option3Visualization({
  tierCounts,
  tierContracts,
  highFundingCount,
  highFundingLine,
  fundingUtilization,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  }
  highFundingCount: number
  highFundingLine: HighFundingLine
  fundingUtilization: FundingUtilizationSummary
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
        tierContracts={tierContracts}
        selectedTier={selectedTier}
        onSelectTier={handleExpirySelect}
      />
      <FundingRiskPanel
        count={highFundingCount}
        fundingLine={highFundingLine}
        fundingUtilization={fundingUtilization}
        selected={selectedTier === 'highFunding'}
        onSelect={() => onSelectTier('highFunding')}
      />
    </div>
  )
}

const O4_TIER_META = [
  { key: 'critical' as const, label: '0–30 days', colorVar: 'var(--ced-o4-critical)' },
  { key: 'warning' as const, label: '31–60 days', colorVar: 'var(--ced-o4-warning)' },
  { key: 'upcoming' as const, label: '61–90 days', colorVar: 'var(--ced-o4-upcoming)' },
] as const

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function pieSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

type PieSlice = {
  key: ExpiryTierKey
  label: string
  colorVar: string
  count: number
  pct: number
  startAngle: number
  endAngle: number
  midAngle: number
}

function ExpiryPieChart({
  slices,
  total,
  selectedTier,
  onSelectTier,
  variant = 'default',
}: {
  slices: PieSlice[]
  total: number
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpiryTierKey) => void
  variant?: 'default' | 'option4'
}) {
  const isOption4 = variant === 'option4'
  const cx = 150
  const cy = 130
  const r = 92
  const explode = 12
  const labelR = r * 0.6
  const svgWidth = 300
  const svgHeight = 260
  const drawable = slices.filter((s) => s.count > 0)
  const isSingleFull = drawable.length === 1 && total > 0

  const renderLeader = (s: PieSlice, ox: number, oy: number) => {
    const onArc = polarToCartesian(cx + ox, cy + oy, r, s.midAngle)
    const elbow = polarToCartesian(cx + ox, cy + oy, r + 14, s.midAngle)
    const isRight = s.midAngle % 360 < 180
    const endX = isRight ? elbow.x + 26 : elbow.x - 26
    const textX = isRight ? endX + 5 : endX - 5
    return (
      <g className="ced-o4-pie__leader" aria-hidden>
        <polyline
          points={`${onArc.x},${onArc.y} ${elbow.x},${elbow.y} ${endX},${elbow.y}`}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth={1}
        />
        <text
          x={textX}
          y={elbow.y}
          className="ced-o4-pie__leader-text"
          textAnchor={isRight ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {s.count} {s.count === 1 ? 'contract' : 'contracts'}
        </text>
      </g>
    )
  }

  const renderSlice = (s: PieSlice) => {
    const selected = selectedTier === s.key
    const dimmed = selectedTier != null && !selected
    const offset = selected ? explode : 0
    const ox = offset * Math.cos(((s.midAngle - 90) * Math.PI) / 180)
    const oy = offset * Math.sin(((s.midAngle - 90) * Math.PI) / 180)
    const labelPos = polarToCartesian(cx + ox, cy + oy, labelR, s.midAngle)

    return (
      <g
        key={s.key}
        className={clsx(
          'ced-o4-pie__slice',
          selected && 'ced-o4-pie__slice--selected',
          dimmed && 'ced-o4-pie__slice--dimmed',
        )}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`Expiring ${s.label}: ${s.count} contracts, ${s.pct}%`}
        onClick={() => onSelectTier(s.key)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelectTier(s.key)
          }
        }}
      >
        {isSingleFull ? (
          <circle cx={cx + ox} cy={cy + oy} r={r} fill={s.colorVar} className="ced-o4-pie__slice-path" />
        ) : (
          <path
            className="ced-o4-pie__slice-path"
            d={pieSlicePath(cx + ox, cy + oy, r, s.startAngle, s.endAngle)}
            fill={s.colorVar}
          />
        )}
        {s.pct >= 6 ? (
          <text
            x={labelPos.x}
            y={labelPos.y}
            className="ced-o4-pie__slice-label"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {s.pct}%
          </text>
        ) : null}
        {renderLeader(s, ox, oy)}
      </g>
    )
  }

  return (
    <svg
      className={clsx('ced-o4-pie', isOption4 && 'ced-o4-pie--centered')}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      aria-label={`Contracts by expiration window: ${slices.map((s) => `${s.label} ${s.count} contracts`).join(', ')}`}
    >
      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-color)" strokeWidth={2} />
      ) : (
        drawable.map(renderSlice)
      )}
    </svg>
  )
}

function Option4Visualization({
  tierCounts,
  highFundingCount,
  highFundingLine,
  fundingUtilization,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  highFundingCount: number
  highFundingLine: HighFundingLine
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}) {
  const total = tierCounts.critical + tierCounts.warning + tierCounts.upcoming

  const slices = useMemo<PieSlice[]>(() => {
    let cursor = 0
    return O4_TIER_META.map((meta) => {
      const count = tierCounts[meta.key]
      const fraction = total > 0 ? count / total : 0
      const startAngle = cursor * 360
      cursor += fraction
      const endAngle = cursor * 360
      return {
        key: meta.key,
        label: meta.label,
        colorVar: meta.colorVar,
        count,
        pct: Math.round(fraction * 100),
        startAngle,
        endAngle,
        midAngle: (startAngle + endAngle) / 2,
      }
    })
  }, [tierCounts, total])

  return (
    <div className="ced-o4-row">
      <section className="ced-o4-panel" aria-label="Contracts by expiration window">
        <div className="ced-o4-panel__head">
          <h2 className="ced-o4-panel__title">Contracts by expiration window</h2>
          <p className="ced-o4-panel__hint">Click a slice to filter the roster below.</p>
        </div>
        <div className="ced-o4-panel__viz">
          <div className="ced-o4-chart-wrap">
            <ExpiryPieChart
              slices={slices}
              total={total}
              selectedTier={selectedTier}
              onSelectTier={onSelectTier}
              variant="option4"
            />
          </div>
          <ul className="ced-o4-legend" role="group" aria-label="Expiration windows">
            {slices.map((s) => {
              const selected = selectedTier === s.key
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    className={clsx('ced-o4-legend__item', selected && 'ced-o4-legend__item--selected')}
                    aria-pressed={selected}
                    onClick={() => onSelectTier(s.key)}
                  >
                    <span className="ced-o4-legend__swatch" style={{ backgroundColor: s.colorVar }} aria-hidden />
                    <span className="ced-o4-legend__label">{s.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <FundingRiskPanel
        count={highFundingCount}
        fundingLine={highFundingLine}
        fundingUtilization={fundingUtilization}
        selected={selectedTier === 'highFunding'}
        onSelect={() => onSelectTier('highFunding')}
        layout="option4"
      />
    </div>
  )
}

export function ContractsExpirationDashboard({
  designOption,
  tierCounts,
  tierContracts,
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
          tierContracts={tierContracts}
          highFundingCount={highFundingCount}
          highFundingLine={highFundingLine}
          fundingUtilization={fundingUtilization}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
        />
      </section>
    )
  }

  if (designOption === 'option4') {
    return (
      <section className="contracts-expiration-dashboard ced-layout-option4" aria-label="Command center contracts by expiration window and funding risk">
        <Option4Visualization
          tierCounts={tierCounts}
          highFundingCount={highFundingCount}
          highFundingLine={highFundingLine}
          fundingUtilization={fundingUtilization}
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
