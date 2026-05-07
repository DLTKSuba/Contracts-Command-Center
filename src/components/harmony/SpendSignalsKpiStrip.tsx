import './SpendSignalsKpiStrip.css'

export type SpendSignalsKpiStripProps = {
  /** Share of portfolio at spend ≥ 65% (0–100). */
  highSpendGe65Pct: number
  fundedValueLabel: string
  fundingGapLabel: string
  unspentBalanceLabel: string
}

const DEFAULT_PROPS: SpendSignalsKpiStripProps = {
  highSpendGe65Pct: 40,
  fundedValueLabel: '$2.10M',
  fundingGapLabel: '$854.00K',
  unspentBalanceLabel: '$1598.00K',
}

/** Wide card: Spend breakdown + cluster of three metrics (balanced gutters vs card padding). */
export function SpendSignalsKpiStrip(props: Partial<SpendSignalsKpiStripProps> = {}) {
  const {
    highSpendGe65Pct,
    fundedValueLabel,
    fundingGapLabel,
    unspentBalanceLabel,
  } = { ...DEFAULT_PROPS, ...props }
  const pct = highSpendGe65Pct
  const pctDisplay = `${pct.toFixed(1)}%`
  const barLabel = `${pctDisplay} of portfolio at greater than or equal to 65 percent spend`

  return (
    <section className="spend-kpi-strip" aria-label="Spend breakdown and funding summary">
      <div className="spend-kpi-strip__wide">
        <div className="spend-kpi-strip__grid">
          <p
            className="spend-kpi-strip__label spend-kpi-strip__area-bd-label"
            id="spend-kpi-breakdown-heading"
          >
            Spend breakdown{' '}
            <span className="spend-kpi-strip__label-paren">(≥ 65%)</span>
          </p>
          <p className="spend-kpi-strip__label spend-kpi-strip__area-fv-label" id="spend-kpi-funded-heading">
            Funded Value
          </p>
          <p className="spend-kpi-strip__label spend-kpi-strip__area-fg-label" id="spend-kpi-gap-heading">
            Funding gap
          </p>
          <p className="spend-kpi-strip__label spend-kpi-strip__area-ub-label" id="spend-kpi-balance-heading">
            Unspent balance
          </p>

          <div
            className="spend-kpi-strip__breakdown-hbar spend-kpi-strip__area-bd-value"
            role="group"
            aria-label={barLabel}
          >
            <div className="spend-kpi-strip__hbar-metric-row">
              <div className="spend-kpi-strip__hbar-track">
                <div className="spend-kpi-strip__hbar-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="spend-kpi-strip__metric spend-kpi-strip__metric--primary-pct">{pctDisplay}</p>
            </div>
          </div>
          <p
            className="spend-kpi-strip__metric spend-kpi-strip__metric--header spend-kpi-strip__area-fv-value"
            aria-labelledby="spend-kpi-funded-heading"
          >
            {fundedValueLabel}
          </p>
          <p
            className="spend-kpi-strip__metric spend-kpi-strip__metric--header spend-kpi-strip__area-fg-value"
            aria-labelledby="spend-kpi-gap-heading"
          >
            {fundingGapLabel}
          </p>
          <p
            className="spend-kpi-strip__metric spend-kpi-strip__metric--header spend-kpi-strip__area-ub-value"
            aria-labelledby="spend-kpi-balance-heading"
          >
            {unspentBalanceLabel}
          </p>
        </div>
      </div>
    </section>
  )
}
