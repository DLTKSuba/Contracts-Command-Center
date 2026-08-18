import clsx from 'clsx'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Card } from './Card'
import { Icon } from './Icon'
import './ContractsExpirationDashboard.css'

export type ExpirationTierKey =
  | 'critical'
  | 'warning'
  | 'upcoming'
  | 'highFunding'
  | 'fundLow'
  | 'fundMid'
  | 'fundHigh'

export type VizDesignOption = 'option1' | 'option2' | 'option3' | 'option4' | 'option5' | 'option6' | 'option7'

/** Chart modes for Option 1 (daily bar chart). */
export type DailyChartIteration = 'iteration1' | 'iteration2' | 'iteration3'

type ExpiryTierKey = 'critical' | 'warning' | 'upcoming'

/** Primary options shown at the top of the View menu (display order). */
const VIZ_PRIMARY_OPTIONS = [
  { value: 'option5' as const, label: 'Timeline Bar Chart' },
]

/** Secondary options under the collapsed “Other explorations” group. */
const VIZ_OTHER_OPTIONS = [
  { value: 'option7' as const, label: 'Option 1 - Daily Bar Chart' },
  { value: 'option6' as const, label: 'Option 6 - Bar Chart' },
  { value: 'option4' as const, label: 'Option 4 - Pie Chart' },
  { value: 'option3' as const, label: 'Option 3 - Timeline & Funding Risk' },
  { value: 'option2' as const, label: 'Option 2 - Dual Visualization' },
  { value: 'option1' as const, label: 'Option 1 - Card Design' },
]

export const VIZ_DESIGN_OPTIONS = [...VIZ_PRIMARY_OPTIONS, ...VIZ_OTHER_OPTIONS] as const

const DAILY_CHART_ITERATIONS = [
  { value: 'iteration1' as const, label: 'Iteration 1 (Weekly rollup)' },
  { value: 'iteration2' as const, label: 'Iteration 2 (Active Expirations)' },
  { value: 'iteration3' as const, label: 'Iteration 3 (Daily rollup)' },
] as const

function labelForVizOption(value: VizDesignOption): string {
  return VIZ_DESIGN_OPTIONS.find((opt) => opt.value === value)?.label ?? value
}

function labelForDailyIteration(value: DailyChartIteration): string {
  return DAILY_CHART_ITERATIONS.find((opt) => opt.value === value)?.label ?? value
}

export function VizDesignOptionPicker({
  value,
  onChange,
  variant = 'default',
}: {
  value: VizDesignOption
  onChange: (value: VizDesignOption) => void
  variant?: 'default' | 'header'
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [otherOpen, setOtherOpen] = useState(() =>
    VIZ_OTHER_OPTIONS.some((opt) => opt.value === value),
  )
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current != null && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (VIZ_OTHER_OPTIONS.some((opt) => opt.value === value)) {
      setOtherOpen(true)
    }
  }, [value])

  const selectOption = (next: VizDesignOption) => {
    onChange(next)
    setMenuOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={clsx(
        'ced-viz-design-picker',
        variant === 'header' && 'ced-viz-design-picker--header',
        menuOpen && 'ced-viz-design-picker--open',
      )}
    >
      <span className="ced-viz-design-picker__label" id="ced-design-option-label">
        View
      </span>
      <div className="ced-viz-design-picker__control">
        <button
          type="button"
          className="select ced-viz-design-picker__trigger"
          aria-labelledby="ced-design-option-label"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-controls="ced-design-option-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="ced-viz-design-picker__trigger-text">{labelForVizOption(value)}</span>
          <Icon
            name={menuOpen ? 'chevron-up' : 'chevron-down'}
            size="xs"
            className="ced-viz-design-picker__trigger-icon"
            aria-hidden
          />
        </button>

        {menuOpen ? (
          <div
            id="ced-design-option-menu"
            className="ced-viz-design-picker__menu"
            role="listbox"
            aria-label="Visualization design option"
          >
            {VIZ_PRIMARY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={clsx(
                  'ced-viz-design-picker__option',
                  value === opt.value && 'ced-viz-design-picker__option--selected',
                )}
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
              </button>
            ))}

            <div className="ced-viz-design-picker__divider" role="separator" />

            <button
              type="button"
              className="ced-viz-design-picker__group-toggle"
              aria-expanded={otherOpen}
              aria-controls="ced-design-option-other"
              onClick={() => setOtherOpen((open) => !open)}
            >
              <span>Other explorations</span>
              <Icon
                name={otherOpen ? 'chevron-up' : 'chevron-down'}
                size="xs"
                className="ced-viz-design-picker__group-chevron"
                aria-hidden
              />
            </button>

            {otherOpen ? (
              <div id="ced-design-option-other" className="ced-viz-design-picker__group" role="group">
                {VIZ_OTHER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    className={clsx(
                      'ced-viz-design-picker__option',
                      'ced-viz-design-picker__option--nested',
                      value === opt.value && 'ced-viz-design-picker__option--selected',
                    )}
                    onClick={() => selectOption(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function DailyChartIterationPicker({
  value,
  onChange,
  variant = 'default',
}: {
  value: DailyChartIteration
  onChange: (value: DailyChartIteration) => void
  variant?: 'default' | 'header'
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current != null && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div
      ref={rootRef}
      className={clsx(
        'ced-viz-design-picker',
        variant === 'header' && 'ced-viz-design-picker--header',
        menuOpen && 'ced-viz-design-picker--open',
      )}
    >
      <span className="ced-viz-design-picker__label" id="ced-daily-iteration-label">
        Iteration
      </span>
      <div className="ced-viz-design-picker__control">
        <button
          type="button"
          className="select ced-viz-design-picker__trigger"
          aria-labelledby="ced-daily-iteration-label"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-controls="ced-daily-iteration-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="ced-viz-design-picker__trigger-text">{labelForDailyIteration(value)}</span>
          <Icon
            name={menuOpen ? 'chevron-up' : 'chevron-down'}
            size="xs"
            className="ced-viz-design-picker__trigger-icon"
            aria-hidden
          />
        </button>

        {menuOpen ? (
          <div
            id="ced-daily-iteration-menu"
            className="ced-viz-design-picker__menu"
            role="listbox"
            aria-label="Daily chart iteration"
          >
            {DAILY_CHART_ITERATIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={clsx(
                  'ced-viz-design-picker__option',
                  value === opt.value && 'ced-viz-design-picker__option--selected',
                )}
                onClick={() => {
                  onChange(opt.value)
                  setMenuOpen(false)
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
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
  /** Full-window funding buckets for the funding risk pie (0–59 / 60–75 / 76+). */
  buckets: { low: number; mid: number; high: number }
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
  /** Clears the active expiration-window filter (e.g. click outside toggles). */
  onClearTier?: () => void
  /** Option 1 chart iteration (weekly / compressed / daily). */
  chartIteration?: DailyChartIteration
  /** Reference date for work-week histogram bins (defaults to today). */
  asOfDate?: Date
}

const ExpiryVizAsOfContext = createContext<Date>(new Date())

function useExpiryVizAsOf(): Date {
  return useContext(ExpiryVizAsOfContext)
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
        <ul className="ced-funding-viz__legend" aria-label="% Contracts by Funding breakdown">
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

type ExpiryDayBin = {
  min: number
  max: number
  weekStart: Date
  weekEnd: Date
  label: string
}

function stripToCalendarDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addCalendarDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return stripToCalendarDate(next)
}

function calendarDaysBetween(from: Date, to: Date): number {
  const ms = stripToCalendarDate(to).getTime() - stripToCalendarDate(from).getTime()
  return Math.round(ms / (24 * 60 * 60 * 1000))
}

/** Monday of the Mon–Fri work week used for histogram bucketing (weekends map to that week). */
function mondayOfWorkWeekContaining(d: Date): Date {
  const date = stripToCalendarDate(d)
  const day = date.getDay()
  if (day === 6) return addCalendarDays(date, -5)
  if (day === 0) return addCalendarDays(date, -6)
  return addCalendarDays(date, 1 - day)
}

function formatWorkWeekLabel(weekStart: Date, weekEnd: Date): string {
  const monthDay: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const start = weekStart.toLocaleDateString('en-US', monthDay)
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${start}–${weekEnd.getDate()}`
  }
  const end = weekEnd.toLocaleDateString('en-US', monthDay)
  return `${start}–${end}`
}

/** Work-week bins (Mon–Fri) that overlap a day range from as-of (inclusive). */
function getExpiryRangeBins(dayMin: number, dayMax: number, asOf: Date): ExpiryDayBin[] {
  const windowStart = addCalendarDays(asOf, dayMin)
  const windowEnd = addCalendarDays(asOf, dayMax)

  const bins: ExpiryDayBin[] = []
  let weekMon = mondayOfWorkWeekContaining(windowStart)

  while (weekMon <= windowEnd) {
    const weekFri = addCalendarDays(weekMon, 4)
    if (weekFri >= windowStart && weekMon <= windowEnd) {
      const overlapStart = weekMon < windowStart ? windowStart : weekMon
      const overlapEnd = weekFri > windowEnd ? windowEnd : weekFri
      bins.push({
        min: calendarDaysBetween(asOf, overlapStart),
        max: calendarDaysBetween(asOf, overlapEnd),
        weekStart: weekMon,
        weekEnd: weekFri,
        label: formatWorkWeekLabel(weekMon, weekFri),
      })
    }
    weekMon = addCalendarDays(weekMon, 7)
  }

  return bins
}

/** One calendar-day bin per day in the range (inclusive), up to 90 days from as-of. */
function getExpiryDailyBins(dayMin: number, dayMax: number, asOf: Date): ExpiryDayBin[] {
  const clampedMax = Math.min(dayMax, 90)
  const clampedMin = Math.max(0, dayMin)
  const bins: ExpiryDayBin[] = []

  for (let day = clampedMin; day <= clampedMax; day++) {
    const date = addCalendarDays(asOf, day)
    bins.push({
      min: day,
      max: day,
      weekStart: date,
      weekEnd: date,
      label: formatAxisDate(date),
    })
  }

  return bins
}

/** Three decade bins within each expiration tier window. */
function getExpiryTierBins(tier: ExpiryTierKey, asOf: Date): ExpiryDayBin[] {
  const ranges =
    tier === 'critical'
      ? [
          { min: 0, max: 10, label: '0–10' },
          { min: 11, max: 20, label: '11–20' },
          { min: 21, max: 30, label: '21–30' },
        ]
      : tier === 'warning'
        ? [
            { min: 31, max: 40, label: '31–40' },
            { min: 41, max: 50, label: '41–50' },
            { min: 51, max: 60, label: '51–60' },
          ]
        : [
            { min: 61, max: 70, label: '61–70' },
            { min: 71, max: 80, label: '71–80' },
            { min: 81, max: 90, label: '81–90' },
          ]

  return ranges.map((range) => {
    const weekStart = addCalendarDays(asOf, range.min)
    const weekEnd = addCalendarDays(asOf, range.max)
    return {
      min: range.min,
      max: range.max,
      weekStart,
      weekEnd,
      label: range.label,
    }
  })
}

function getExpiryChartRange(selectedTier: ExpirationTierKey | null): {
  dayMin: number
  dayMax: number
  rangeLabel: string
} {
  if (selectedTier === 'critical') {
    return { dayMin: 0, dayMax: 30, rangeLabel: '0–30 days' }
  }
  if (selectedTier === 'warning') {
    return { dayMin: 31, dayMax: 60, rangeLabel: '31–60 days' }
  }
  if (selectedTier === 'upcoming') {
    return { dayMin: 61, dayMax: 90, rangeLabel: '61–90 days' }
  }
  return { dayMin: 0, dayMax: 90, rangeLabel: 'Next 90 days' }
}

function contractsForChartRange(
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  },
  dayMin: number,
  dayMax: number,
): ExpiryTierContract[] {
  return [...tierContracts.critical, ...tierContracts.warning, ...tierContracts.upcoming].filter(
    (contract) => contract.daysRemaining >= dayMin && contract.daysRemaining <= dayMax,
  )
}

function formatAxisDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function activeExpiryTierFromSelection(selectedTier: ExpirationTierKey | null): ExpiryTierKey | null {
  if (selectedTier === 'critical' || selectedTier === 'warning' || selectedTier === 'upcoming') {
    return selectedTier
  }
  return null
}

function binIndexForDay(day: number, bins: ExpiryDayBin[], asOf: Date): number {
  const expiry = addCalendarDays(asOf, day)
  const weekMon = mondayOfWorkWeekContaining(expiry)
  return bins.findIndex(
    (bin) => stripToCalendarDate(bin.weekStart).getTime() === stripToCalendarDate(weekMon).getTime(),
  )
}

function groupContractsByBin(contracts: ExpiryTierContract[], bins: ExpiryDayBin[], asOf: Date) {
  return bins.map((bin, index) => {
    const inBin = contracts.filter((c) => binIndexForDay(c.daysRemaining, bins, asOf) === index)
    return { index, bin, contracts: inBin, count: inBin.length }
  })
}

function groupContractsByDayBins(contracts: ExpiryTierContract[], bins: ExpiryDayBin[]) {
  return bins.map((bin, index) => {
    const inBin = contracts.filter(
      (c) => c.daysRemaining >= bin.min && c.daysRemaining <= bin.max,
    )
    return { index, bin, contracts: inBin, count: inBin.length }
  })
}

function ExpiryBarTooltipContent({
  contracts,
  dateUnderName = false,
}: {
  contracts: ExpiryTierContract[]
  /** When true, show each contract’s expiration date directly under its name. */
  dateUnderName?: boolean
}) {
  const count = contracts.length
  const uniqueDates = [...new Set(contracts.map((c) => c.expirationDate))]

  return (
    <div className="ced-o3-bar-tooltip">
      <p className="ced-o3-bar-tooltip__summary">
        {count} {count === 1 ? 'contract' : 'contracts'} expiring
      </p>
      <div className="ced-o3-bar-tooltip__divider" role="presentation" />
      <ul className="ced-o3-bar-tooltip__names">
        {contracts.map((contract, index) => (
          <li
            key={`${contract.name}-${contract.expirationDate}-${index}`}
            className={clsx(
              'ced-o3-bar-tooltip__item',
              dateUnderName && 'ced-o3-bar-tooltip__item--with-date',
            )}
          >
            <span className="ced-o3-bar-tooltip__name">{contract.name}</span>
            {dateUnderName ? (
              <span className="ced-o3-bar-tooltip__date">{contract.expirationDate}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {!dateUnderName ? (
        <>
          <div className="ced-o3-bar-tooltip__divider" role="presentation" />
          <div className="ced-o3-bar-tooltip__dates">
            {uniqueDates.length === 1 ? (
              <p className="ced-o3-bar-tooltip__row">Expiration date: {uniqueDates[0]}</p>
            ) : (
              <>
                <p className="ced-o3-bar-tooltip__row">Expiration date:</p>
                {uniqueDates.map((date) => (
                  <p key={date} className="ced-o3-bar-tooltip__row ced-o3-bar-tooltip__row--indent">
                    {date}
                  </p>
                ))}
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

/** Fixed-position overlay tooltip so daily chart scroll containers never clip it. */
function GraphOverlayTooltip({
  content,
  text,
  children,
}: {
  content?: ReactNode
  text?: string
  children: ReactNode
}) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null)

  const show = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    // Anchor to the visible bar (not the full column hit area) so short grey
    // placeholders get a tooltip tight above the bar itself.
    const bar = trigger.querySelector<HTMLElement>('.ced-o3-mini-viz__bar')
    const rect = (bar ?? trigger).getBoundingClientRect()
    setAnchor({
      left: rect.left + rect.width / 2,
      top: rect.top,
    })
  }

  const hide = () => setAnchor(null)

  const body = content != null ? content : text
  const isCompact = content == null && typeof text === 'string'

  return (
    <>
      <div
        ref={triggerRef}
        className="ced-o6-overlay-tooltip-trigger"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {anchor != null && body != null
        ? createPortal(
            <div
              className={clsx('ced-o6-overlay-tooltip', isCompact && 'ced-o6-overlay-tooltip--compact')}
              style={{ left: anchor.left, top: anchor.top }}
              role="tooltip"
            >
              {body}
            </div>,
            document.body,
          )
        : null}
    </>
  )
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

function tierKeyForBin(bin: ExpiryDayBin): ExpiryTierKey {
  if (bin.min <= 30) return 'critical'
  if (bin.min <= 60) return 'warning'
  return 'upcoming'
}

/** Successive shades of a tier color so stacked contracts stay in one hue family. */
function stackShadeForTier(tier: ExpiryTierKey, index: number, total: number): string {
  const bases: Record<ExpiryTierKey, { r: number; g: number; b: number }> = {
    critical: { r: 216, g: 49, b: 72 },
    warning: { r: 230, g: 111, b: 81 },
    upcoming: { r: 40, g: 69, b: 85 },
  }
  const base = bases[tier]
  const lighten = total <= 1 ? 0 : (index / Math.max(total - 1, 1)) * 0.48
  const r = Math.round(base.r + (255 - base.r) * lighten)
  const g = Math.round(base.g + (255 - base.g) * lighten)
  const b = Math.round(base.b + (255 - base.b) * lighten)
  return `rgb(${r}, ${g}, ${b})`
}

function WorkWeekBarPlot({
  grouped,
  fixedTier,
  plotClassName,
  slotClassName,
  axisMarkers = false,
  axisLabelClassName,
  binLabelKind = 'week',
  emptyBinMode = 'grey',
  tooltipDateUnderName,
}: {
  grouped: ReturnType<typeof groupContractsByBin>
  fixedTier?: ExpiryTierKey | null
  plotClassName?: string
  slotClassName?: string
  axisMarkers?: boolean
  axisLabelClassName?: string
  binLabelKind?: 'week' | 'day'
  /** How to render bins with zero contracts. */
  emptyBinMode?: 'grey' | 'tick' | 'hide'
  /** Overrides where the tooltip puts each contract's expiration date. */
  tooltipDateUnderName?: boolean
}) {
  const dateUnderName = tooltipDateUnderName ?? binLabelKind === 'week'

  const visibleGrouped = useMemo(
    () => (emptyBinMode === 'hide' ? grouped.filter((group) => group.count > 0) : grouped),
    [grouped, emptyBinMode],
  )
  const maxBinCount = useMemo(
    () => Math.max(1, ...visibleGrouped.map((group) => group.count)),
    [visibleGrouped],
  )

  return (
    <div className={clsx('ced-o3-mini-viz__plot', plotClassName)}>
      {visibleGrouped.map(({ index, bin, contracts: binContracts, count: binCount }) => {
        const tier = fixedTier ?? tierKeyForBin(bin)
        const barHeight = expiryBinBarHeightPercent(binCount, maxBinCount)
        const emptyBarHeight = expiryBinBarHeightPercent(0, maxBinCount)
        const binAria =
          binLabelKind === 'day' ? `days ${bin.label}` : `work week ${bin.label}`
        const useStackedSegments = binCount > 1

        return (
          <div
            key={`bin-${index}`}
            className={clsx('ced-o3-mini-viz__bin-column', `ced-o3-mini-viz--${tier}`)}
          >
            <div className={clsx('ced-o3-mini-viz__bin-slot', slotClassName)}>
              {binCount > 0 ? (
                <GraphOverlayTooltip
                  content={
                    <ExpiryBarTooltipContent contracts={binContracts} dateUnderName={dateUnderName} />
                  }
                >
                  <span
                    className="ced-o3-mini-viz__bar-hit"
                    role="img"
                    aria-label={`${binCount} ${binCount === 1 ? 'contract' : 'contracts'}, ${binAria}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {useStackedSegments ? (
                      <span
                        className="ced-o3-mini-viz__bar ced-o3-mini-viz__bar--stack"
                        style={{ height: `${barHeight}%` }}
                        aria-hidden
                      >
                        {binContracts.map((contract, segmentIndex) => (
                          <span
                            key={`${contract.name}-${contract.expirationDate}-${segmentIndex}`}
                            className="ced-o3-mini-viz__bar-segment"
                            style={{
                              backgroundColor: stackShadeForTier(tier, segmentIndex, binCount),
                            }}
                          />
                        ))}
                      </span>
                    ) : (
                      <span
                        className="ced-o3-mini-viz__bar"
                        style={{ height: `${barHeight}%` }}
                        aria-hidden
                      />
                    )}
                  </span>
                </GraphOverlayTooltip>
              ) : emptyBinMode === 'tick' ? (
                <GraphOverlayTooltip text="No contracts expiring">
                  <span
                    className="ced-o3-mini-viz__bar-hit ced-o3-mini-viz__bar-hit--empty ced-o3-mini-viz__bar-hit--tick"
                    role="img"
                    aria-label={`No contracts expiring, ${binAria}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="ced-o3-mini-viz__empty-tick" aria-hidden />
                  </span>
                </GraphOverlayTooltip>
              ) : (
                <GraphOverlayTooltip text="No contracts expiring">
                  <span
                    className={clsx(
                      'ced-o3-mini-viz__bar-hit',
                      'ced-o3-mini-viz__bar-hit--empty',
                      'ced-o3-mini-viz__bar-hit--empty-grey',
                    )}
                    role="img"
                    aria-label={`No contracts expiring, ${binAria}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className={clsx(
                        'ced-o3-mini-viz__bar',
                        'ced-o3-mini-viz__bar--empty',
                        'ced-o3-mini-viz__bar--empty-grey',
                      )}
                      style={{ height: `${emptyBarHeight}%` }}
                      aria-hidden
                    />
                  </span>
                </GraphOverlayTooltip>
              )}
            </div>
            {axisMarkers ? (
              <div className="ced-week-bar-marker-slot" aria-hidden>
                <span className="ced-week-bar-marker" />
              </div>
            ) : null}
            <span className={clsx('ced-o3-mini-viz__axis-label', axisLabelClassName)}>{bin.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function MiniTierViz({
  tier,
  count,
  contracts,
  axisMarkers = false,
  emptyBinMode = 'grey',
}: {
  tier: ExpiryTierKey
  count: number
  contracts: ExpiryTierContract[]
  axisMarkers?: boolean
  emptyBinMode?: 'grey' | 'tick' | 'hide'
}) {
  const asOf = useExpiryVizAsOf()
  const bins = useMemo(() => getExpiryTierBins(tier, asOf), [tier, asOf])
  const grouped = useMemo(() => groupContractsByDayBins(contracts, bins), [contracts, bins])

  const rangeLabel =
    bins.length > 0
      ? `${bins[0].label} through ${bins[bins.length - 1].label}`
      : 'no day ranges in window'

  return (
    <div
      className={clsx(
        'ced-o3-mini-viz',
        'ced-o3-mini-viz--decades',
        `ced-o3-mini-viz--${tier}`,
        count === 0 && 'ced-o3-mini-viz--empty',
      )}
      role="group"
      aria-label={
        count === 0
          ? `No contracts expiring across day ranges ${rangeLabel}`
          : `${count} contracts, expiring across day ranges ${rangeLabel}`
      }
    >
      <WorkWeekBarPlot
        grouped={grouped}
        fixedTier={tier}
        axisMarkers={axisMarkers}
        emptyBinMode={emptyBinMode}
        binLabelKind="day"
        tooltipDateUnderName
      />
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
    <section className="ced-o3-panel ced-o3-expiring-panel" aria-label="Contracts Expiration Window">
      <h2 className="ced-o3-panel__title">Contracts Expiration Window</h2>
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

const FUNDING_PIE_SEGMENTS = [
  {
    key: 'fundLow' as const,
    label: '0–59%',
    color: '#1e3a5f',
    labelFill: '#ffffff',
    countFrom: (summary: FundingUtilizationSummary) => summary.buckets.low,
  },
  {
    key: 'fundMid' as const,
    label: '60–75%',
    color: '#d4a84b',
    labelFill: '#1f2937',
    countFrom: (summary: FundingUtilizationSummary) => summary.buckets.mid,
  },
  {
    key: 'fundHigh' as const,
    label: '76%+',
    color: '#2a9d8f',
    labelFill: '#ffffff',
    countFrom: (summary: FundingUtilizationSummary) => summary.buckets.high,
  },
] as const

type FundingPieSlice = {
  key: 'fundLow' | 'fundMid' | 'fundHigh'
  label: string
  color: string
  labelFill: string
  count: number
  startAngle: number
  endAngle: number
  midAngle: number
}

function FundingRiskPieChart({
  summary,
  selectedTier,
  onSelectTier,
}: {
  summary: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}) {
  const cx = 140
  const cy = 112
  const r = 78
  /** Even radial separation for every visible slice. */
  const sliceSeparation = 2.88
  /** Extra pull only for the selected slice. */
  const selectedExtra = 6
  /** Equal angular white gap between neighboring slices. */
  const sliceGapDeg = 2.304
  const labelR = r * 0.58
  const svgWidth = 280
  const svgHeight = 228
  const total = summary.totalInWindow

  const slices = useMemo<FundingPieSlice[]>(() => {
    const withCounts = FUNDING_PIE_SEGMENTS.map((meta) => ({
      ...meta,
      count: meta.countFrom(summary),
    }))
    const visibleCount = withCounts.filter((s) => s.count > 0).length
    const gap = visibleCount > 1 ? sliceGapDeg : 0
    let cursor = 0
    return withCounts.map((meta) => {
      const fraction = total > 0 ? meta.count / total : 0
      const rawStart = cursor * 360
      cursor += fraction
      const rawEnd = cursor * 360
      const startAngle = meta.count > 0 ? rawStart + gap / 2 : rawStart
      const endAngle = meta.count > 0 ? rawEnd - gap / 2 : rawEnd
      return {
        key: meta.key,
        label: meta.label,
        color: meta.color,
        labelFill: meta.labelFill,
        count: meta.count,
        startAngle,
        endAngle,
        midAngle: (startAngle + endAngle) / 2,
      }
    })
  }, [summary, total])

  const drawable = slices.filter((s) => s.count > 0)
  const isSingleFull = drawable.length === 1 && total > 0
  const anyBucketSelected =
    selectedTier === 'fundLow' || selectedTier === 'fundMid' || selectedTier === 'fundHigh'

  const renderLeader = (s: FundingPieSlice, ox: number, oy: number) => {
    const onArc = polarToCartesian(cx + ox, cy + oy, r, s.midAngle)
    const elbow = polarToCartesian(cx + ox, cy + oy, r + 10, s.midAngle)
    const isRight = ((s.midAngle % 360) + 360) % 360 < 180
    const endX = isRight ? elbow.x + 20 : elbow.x - 20
    const textX = isRight ? endX + 4 : endX - 4
    return (
      <g className="ced-funding-pie__leader" aria-hidden>
        <polyline
          points={`${onArc.x},${onArc.y} ${elbow.x},${elbow.y} ${endX},${elbow.y}`}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1}
        />
        <text
          x={textX}
          y={elbow.y}
          className="ced-funding-pie__leader-text"
          textAnchor={isRight ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {s.count} {s.count === 1 ? 'contract' : 'contracts'}
        </text>
      </g>
    )
  }

  const renderSlice = (s: FundingPieSlice) => {
    const selected = selectedTier === s.key
    const dimmed = anyBucketSelected && !selected
    const offset =
      (drawable.length > 1 ? sliceSeparation : 0) + (selected ? selectedExtra : 0)
    const ox = offset * Math.cos(((s.midAngle - 90) * Math.PI) / 180)
    const oy = offset * Math.sin(((s.midAngle - 90) * Math.PI) / 180)
    const labelPos = polarToCartesian(cx + ox, cy + oy, labelR, s.midAngle)
    const span = s.endAngle - s.startAngle

    return (
      <g
        key={s.key}
        className={clsx(
          'ced-funding-pie__slice',
          selected && 'ced-funding-pie__slice--selected',
          dimmed && 'ced-funding-pie__slice--dimmed',
        )}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`${s.label} funding used: ${s.count} contracts`}
        onClick={(e) => {
          e.stopPropagation()
          onSelectTier(s.key)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            onSelectTier(s.key)
          }
        }}
      >
        {isSingleFull ? (
          <circle cx={cx + ox} cy={cy + oy} r={r} fill={s.color} className="ced-funding-pie__slice-path" />
        ) : (
          <path
            className="ced-funding-pie__slice-path"
            d={pieSlicePath(cx + ox, cy + oy, r, s.startAngle, s.endAngle)}
            fill={s.color}
          />
        )}
        {span >= 18 ? (
          <text
            x={labelPos.x}
            y={labelPos.y}
            className="ced-funding-pie__slice-label"
            fill={s.labelFill}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {s.label}
          </text>
        ) : null}
        {renderLeader(s, ox, oy)}
      </g>
    )
  }

  return (
    <svg
      className="ced-funding-pie"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      aria-label={`Funding used by range: ${slices.map((s) => `${s.label} ${s.count} contracts`).join(', ')}`}
    >
      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-color)" strokeWidth={2} />
      ) : (
        drawable.map(renderSlice)
      )}
    </svg>
  )
}

function FundingRiskCard({
  fundingUtilization,
  selectedTier,
  onSelectTier,
  layout = 'default',
}: {
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
  layout?: 'default' | 'option4' | 'embedded'
}) {
  const isOption4 = layout === 'option4'
  const isEmbedded = layout === 'embedded'
  const anyBucketSelected =
    selectedTier === 'fundLow' || selectedTier === 'fundMid' || selectedTier === 'fundHigh'

  return (
    <article
      className={clsx(
        'ced-o3-funding-card',
        'ced-o3-funding-card--pie',
        isEmbedded && 'ced-o3-funding-card--embedded',
        isOption4 && 'ced-o3-funding-card--option4',
        anyBucketSelected && !isEmbedded && 'ced-o3-funding-card--selected',
      )}
      aria-label="Funding used by range pie chart"
    >
      <div className="ced-o3-funding-card__body ced-o3-funding-card__body--pie">
        <div className="ced-funding-pie__chart">
          <FundingRiskPieChart
            summary={fundingUtilization}
            selectedTier={selectedTier}
            onSelectTier={onSelectTier}
          />
        </div>
        <ul className="ced-funding-pie__legend" aria-label="Funding used ranges">
          {FUNDING_PIE_SEGMENTS.map((segment) => {
            const selected = selectedTier === segment.key
            return (
              <li key={segment.key}>
                <button
                  type="button"
                  className={clsx(
                    'ced-funding-pie__legend-item',
                    selected && 'ced-funding-pie__legend-item--selected',
                  )}
                  aria-pressed={selected}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTier(segment.key)
                  }}
                >
                  <span
                    className="ced-funding-pie__legend-swatch"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden
                  />
                  <span className="ced-funding-pie__legend-label">{segment.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

function FundingRiskPanel({
  fundingUtilization,
  selectedTier,
  onSelectTier,
  layout = 'default',
}: {
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
  layout?: 'default' | 'option4' | 'embedded'
}) {
  const anyBucketSelected =
    selectedTier === 'fundLow' || selectedTier === 'fundMid' || selectedTier === 'fundHigh'

  if (layout === 'option4') {
    return (
      <section className="ced-o4-panel ced-o4-funding-panel" aria-label="% Contracts by Funding">
        <div className="ced-o4-panel__head">
          <h2 className="ced-o3-panel__title">% Contracts by Funding</h2>
        </div>
        <div className="ced-o4-panel__viz">
          <FundingRiskCard
            fundingUtilization={fundingUtilization}
            selectedTier={selectedTier}
            onSelectTier={onSelectTier}
            layout="option4"
          />
        </div>
      </section>
    )
  }

  return (
    <section
      className={clsx(
        'ced-o3-panel',
        'ced-o3-funding-panel',
        'ced-o3-funding-panel--embedded',
        anyBucketSelected && 'ced-o3-funding-panel--selected',
      )}
      aria-label="% Contracts by Funding"
    >
      <div className="ced-o3-funding-panel__head">
        <h2 className="ced-o3-panel__title">% Contracts by Funding</h2>
      </div>
      <FundingRiskCard
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
        layout="embedded"
      />
    </section>
  )
}

function Option3Visualization({
  tierCounts,
  tierContracts,
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
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
      />
    </div>
  )
}

const O4_TIER_META = [
  { key: 'critical' as const, label: '0–30 days', colorVar: 'var(--ced-o4-critical)' },
  { key: 'warning' as const, label: '31–60 days', colorVar: 'var(--ced-o4-warning)' },
  { key: 'upcoming' as const, label: '61–90 days', colorVar: 'var(--ced-o4-upcoming)' },
] as const

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
  fundingUtilization,
  selectedTier,
  onSelectTier,
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
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
          <h2 className="ced-o3-panel__title">Contracts by expiration window</h2>
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
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
        layout="option4"
      />
    </div>
  )
}

function ExpirationTimelinePanel({
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
  const asOf = useExpiryVizAsOf()
  const totalInWindow = tierCounts.critical + tierCounts.warning + tierCounts.upcoming
  const windowStart = formatAxisDate(asOf)
  const windowEnd = formatAxisDate(addCalendarDays(asOf, 90))

  return (
    <section className="ced-o3-panel ced-o5-timeline-panel" aria-label="Contracts Expiration Window">
      <div className="ced-o5-timeline-panel__head">
        <h2 className="ced-o3-panel__title">Contracts Expiration Window</h2>
      </div>
      <div className="ced-o5-timeline-columns" role="group" aria-label="Expiration windows">
        {O3_EXPIRY_TIER_META.map((meta) => {
          const count = tierCounts[meta.tier]
          const selected = selectedTier === meta.tier
          const headingId = `ced-o5-${meta.tier}-heading`

          return (
            <button
              key={meta.tier}
              type="button"
              className={clsx(
                'ced-o5-timeline-column',
                `ced-o5-timeline-column--${meta.tier}`,
                selected && 'ced-o5-timeline-column--selected',
              )}
              aria-labelledby={headingId}
              aria-pressed={selected}
              onClick={() => onSelectTier(meta.tier)}
            >
              <div className="ced-o5-timeline-column__kpi">
                <p className="ced-o5-timeline-column__count" aria-label={`${count} contracts`}>
                  {count}
                </p>
                <p className="ced-o5-timeline-column__label" id={headingId}>
                  {meta.label}
                </p>
              </div>
              <div
                className={clsx(
                  'ced-o5-timeline-column__segment',
                  `ced-o5-timeline-column__segment--${meta.tier}`,
                )}
              >
                <MiniTierViz
                  tier={meta.tier}
                  count={count}
                  contracts={tierContracts[meta.tier]}
                  axisMarkers
                  emptyBinMode="tick"
                />
                <p className="ced-o5-timeline-column__axis-caption">Days until expiration</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="ced-o5-timeline-panel__footer">
        <p className="ced-o5-timeline-panel__summary">
          {totalInWindow} contract{totalInWindow === 1 ? '' : 's'} expiring {windowStart} – {windowEnd}
        </p>
        <p className="ced-o5-timeline-panel__hint">
          Each bar groups contracts by a 10-day span; bar height is how many expire in it. Hover a bar for
          contract names and dates.
        </p>
      </div>
    </section>
  )
}

function Option5Visualization({
  tierCounts,
  tierContracts,
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
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
}) {
  const handleExpirySelect = (tier: ExpiryTierKey) => {
    onSelectTier(tier)
  }

  return (
    <div className="ced-o5-row">
      <ExpirationTimelinePanel
        tierCounts={tierCounts}
        tierContracts={tierContracts}
        selectedTier={selectedTier}
        onSelectTier={handleExpirySelect}
      />
      <FundingRiskPanel
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
      />
    </div>
  )
}

function ExpiryBarChart({
  contracts,
  dayMin,
  dayMax,
  rangeLabel,
  activeExpiryTier,
  granularity = 'week',
  emptyBinMode = 'grey',
}: {
  contracts: ExpiryTierContract[]
  dayMin: number
  dayMax: number
  rangeLabel: string
  activeExpiryTier: ExpiryTierKey | null
  granularity?: 'week' | 'day'
  emptyBinMode?: 'grey' | 'tick' | 'hide'
}) {
  const asOf = useExpiryVizAsOf()
  const isDaily = granularity === 'day'
  const plotAreaRef = useRef<HTMLDivElement>(null)
  const bins = useMemo(
    () => (isDaily ? getExpiryDailyBins(dayMin, dayMax, asOf) : getExpiryRangeBins(dayMin, dayMax, asOf)),
    [dayMin, dayMax, asOf, isDaily],
  )
  const grouped = useMemo(
    () => (isDaily ? groupContractsByDayBins(contracts, bins) : groupContractsByBin(contracts, bins, asOf)),
    [contracts, bins, asOf, isDaily],
  )
  const isCompressed = emptyBinMode === 'hide'
  const isScrollableDaily = isDaily && !isCompressed

  useLayoutEffect(() => {
    if (!isScrollableDaily) return
    const plotArea = plotAreaRef.current
    if (plotArea == null) return
    plotArea.scrollLeft = 0
    const frame = requestAnimationFrame(() => {
      plotArea.scrollLeft = 0
    })
    return () => cancelAnimationFrame(frame)
  }, [isScrollableDaily, dayMin, dayMax, activeExpiryTier, bins.length, emptyBinMode])

  const xAxisTitle = `Expiration date (${rangeLabel})`

  return (
    <div
      className={clsx(
        'ced-o6-chart-wrap',
        isScrollableDaily && 'ced-o6-chart-wrap--daily',
        isCompressed && 'ced-o6-chart-wrap--compressed',
      )}
    >
      <div
        className="ced-o6-chart-with-axes"
        role="img"
        aria-label={`Contracts expiring by ${isDaily ? 'day' : 'work week'}, ${rangeLabel}: ${grouped.map((g) => `${g.bin.label} ${g.count}`).join(', ')}`}
      >
        <div className="ced-o6-chart__body">
          <div
            ref={plotAreaRef}
            className={clsx(
              'ced-o6-chart__plot-area',
              isScrollableDaily && 'ced-o6-chart__plot-area--scroll',
              isCompressed && 'ced-o6-chart__plot-area--compressed',
            )}
          >
            <div className="ced-o6-chart__y-axis-line" aria-hidden />
            <div
              className={clsx(
                'ced-o6-chart__plot',
                'ced-o3-mini-viz',
                'ced-o6-bar-plot',
                isScrollableDaily && 'ced-o6-bar-plot--daily',
                isCompressed && 'ced-o6-bar-plot--compressed',
              )}
            >
              <WorkWeekBarPlot
                grouped={grouped}
                fixedTier={activeExpiryTier}
                plotClassName={clsx(
                  'ced-o6-bar-plot__plot',
                  isScrollableDaily && 'ced-o6-bar-plot__plot--daily',
                  isCompressed && 'ced-o6-bar-plot__plot--compressed',
                )}
                slotClassName="ced-o6-bar-plot__slot"
                axisMarkers
                axisLabelClassName={clsx(
                  'ced-o6-bar-plot__axis-label',
                  isDaily && 'ced-o6-bar-plot__axis-label--daily',
                )}
                binLabelKind={isDaily ? 'day' : 'week'}
                emptyBinMode={emptyBinMode}
              />
            </div>
          </div>
          <p className="ced-o6-chart__x-axis-title">{xAxisTitle}</p>
          {emptyBinMode !== 'grey' ? (
            <ul className="ced-o6-chart__legend" aria-label="Expiration window colors">
              {O3_EXPIRY_TIER_META.filter(
                (meta) => activeExpiryTier == null || activeExpiryTier === meta.tier,
              ).map((meta) => (
                <li key={meta.tier} className="ced-o6-chart__legend-item">
                  <span
                    className={clsx(
                      'ced-o6-chart__legend-swatch',
                      `ced-o6-chart__legend-swatch--${meta.tier}`,
                    )}
                    aria-hidden
                  />
                  <span className="ced-o6-chart__legend-label">{meta.label.replace(/\u2013/g, '-')}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ExpirationBarChartPanel({
  tierCounts,
  tierContracts,
  selectedTier,
  onSelectTier,
  onClearTier,
  granularity = 'week',
  emptyBinMode = 'grey',
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  }
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpiryTierKey) => void
  onClearTier?: () => void
  granularity?: 'week' | 'day'
  emptyBinMode?: 'grey' | 'tick' | 'hide'
}) {
  const activeExpiryTier = activeExpiryTierFromSelection(selectedTier)
  const { dayMin, dayMax, rangeLabel } = getExpiryChartRange(activeExpiryTier)
  const chartContracts = useMemo(
    () => contractsForChartRange(tierContracts, dayMin, dayMax),
    [tierContracts, dayMin, dayMax],
  )
  const isDaily = granularity === 'day'

  const handlePanelBackdropClick = (e: MouseEvent<HTMLElement>) => {
    if (!onClearTier || activeExpiryTier == null) return
    const target = e.target as HTMLElement
    if (target.closest('.ced-o6-window-toggle')) return
    if (target.closest('.ced-o3-mini-viz__bar-hit')) return
    if (target.closest('.tooltip')) return
    onClearTier()
  }

  return (
    <section
      className={clsx(
        'ced-o3-panel',
        'ced-o6-bar-panel',
        (isDaily || emptyBinMode !== 'grey') && 'ced-o6-bar-panel--daily',
      )}
      aria-label="Contracts Expiration Window"
      onClick={handlePanelBackdropClick}
    >
      <div className="ced-o6-bar-panel__head">
        <div>
          <h2 className="ced-o3-panel__title">Contracts Expiration Window</h2>
          {!isDaily && emptyBinMode === 'grey' ? (
            <p className="ced-o6-bar-panel__hint">
              Default shows the next 90 days. Click a window to zoom the chart; click outside to reset.
            </p>
          ) : null}
        </div>
      </div>

      <div className="ced-o6-window-toggles" role="group" aria-label="Expiration windows">
        {O3_EXPIRY_TIER_META.map((meta) => {
          const count = tierCounts[meta.tier]
          const selected = selectedTier === meta.tier
          const headingId = `ced-o6-${meta.tier}-heading`

          return (
            <button
              key={meta.tier}
              type="button"
              className={clsx(
                'ced-o6-window-toggle',
                `ced-o6-window-toggle--${meta.tier}`,
                selected && 'ced-o6-window-toggle--selected',
              )}
              aria-labelledby={headingId}
              aria-pressed={selected}
              onClick={(e) => {
                e.stopPropagation()
                onSelectTier(meta.tier)
              }}
            >
              <span className="ced-o6-window-toggle__count" aria-label={`${count} contracts`}>
                {count}
              </span>
              <span className="ced-o6-window-toggle__label" id={headingId}>
                {meta.label}
              </span>
            </button>
          )
        })}
      </div>

      <ExpiryBarChart
        contracts={chartContracts}
        dayMin={dayMin}
        dayMax={dayMax}
        rangeLabel={rangeLabel}
        activeExpiryTier={activeExpiryTier}
        granularity={granularity}
        emptyBinMode={emptyBinMode}
      />
    </section>
  )
}

function Option6Visualization({
  tierCounts,
  tierContracts,
  fundingUtilization,
  selectedTier,
  onSelectTier,
  onClearTier,
  granularity = 'week',
  emptyBinMode = 'grey',
}: {
  tierCounts: { critical: number; warning: number; upcoming: number }
  tierContracts: {
    critical: ExpiryTierContract[]
    warning: ExpiryTierContract[]
    upcoming: ExpiryTierContract[]
  }
  fundingUtilization: FundingUtilizationSummary
  selectedTier: ExpirationTierKey | null
  onSelectTier: (tier: ExpirationTierKey) => void
  onClearTier?: () => void
  granularity?: 'week' | 'day'
  emptyBinMode?: 'grey' | 'tick' | 'hide'
}) {
  const handleExpirySelect = (tier: ExpiryTierKey) => {
    onSelectTier(tier)
  }

  return (
    <div className="ced-o6-row">
      <ExpirationBarChartPanel
        tierCounts={tierCounts}
        tierContracts={tierContracts}
        selectedTier={selectedTier}
        onSelectTier={handleExpirySelect}
        onClearTier={onClearTier}
        granularity={granularity}
        emptyBinMode={emptyBinMode}
      />
      <FundingRiskPanel
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
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
  onClearTier,
  chartIteration = 'iteration1',
  asOfDate,
}: ContractsExpirationDashboardProps) {
  const asOf = useMemo(() => asOfDate ?? new Date(), [asOfDate])

  return (
    <ExpiryVizAsOfContext.Provider value={asOf}>
      <ContractsExpirationDashboardBody
        designOption={designOption}
        tierCounts={tierCounts}
        tierContracts={tierContracts}
        tierExpiryLines={tierExpiryLines}
        highFundingCount={highFundingCount}
        highFundingLine={highFundingLine}
        fundingUtilization={fundingUtilization}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
        onClearTier={onClearTier}
        chartIteration={chartIteration}
      />
    </ExpiryVizAsOfContext.Provider>
  )
}

function ContractsExpirationDashboardBody({
  designOption,
  tierCounts,
  tierContracts,
  tierExpiryLines,
  highFundingCount,
  highFundingLine,
  fundingUtilization,
  selectedTier,
  onSelectTier,
  onClearTier,
  chartIteration = 'iteration1',
}: Omit<ContractsExpirationDashboardProps, 'asOfDate'>) {
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
          fundingUtilization={fundingUtilization}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
        />
      </section>
    )
  }

  if (designOption === 'option5') {
    return (
      <section className="contracts-expiration-dashboard ced-layout-option5" aria-label="Command center expiration timeline and funding risk">
        <Option5Visualization
          tierCounts={tierCounts}
          tierContracts={tierContracts}
          fundingUtilization={fundingUtilization}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
        />
      </section>
    )
  }

  if (designOption === 'option6') {
    return (
      <section className="contracts-expiration-dashboard ced-layout-option6" aria-label="Command center expiration bar chart and funding risk">
        <Option6Visualization
          tierCounts={tierCounts}
          tierContracts={tierContracts}
          fundingUtilization={fundingUtilization}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
          onClearTier={onClearTier}
        />
      </section>
    )
  }

  if (designOption === 'option7') {
    // Iteration 1: weekly · Iteration 2: days with contracts · Iteration 3: daily with ticks
    const granularity = chartIteration === 'iteration1' ? 'week' : 'day'
    const emptyBinMode = chartIteration === 'iteration2' ? 'hide' : 'tick'
    return (
      <section className="contracts-expiration-dashboard ced-layout-option7" aria-label="Command center daily expiration bar chart and funding risk">
        <Option6Visualization
          tierCounts={tierCounts}
          tierContracts={tierContracts}
          fundingUtilization={fundingUtilization}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
          onClearTier={onClearTier}
          granularity={granularity}
          emptyBinMode={emptyBinMode}
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
          title="% Contracts by Funding"
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
