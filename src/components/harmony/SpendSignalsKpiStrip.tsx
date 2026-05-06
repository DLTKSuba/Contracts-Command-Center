import './SpendSignalsKpiStrip.css'

/**
 * Demo: share of portfolio at spend greater than or equal to 65% (0–100).
 * Wire to live data when available.
 */
const HIGH_SPEND_GE65_PCT = 40

/** Wide KPI strip aligned with Command Center tier cards (`.ced-card` chrome). */
export function SpendSignalsKpiStrip() {
  const pct = HIGH_SPEND_GE65_PCT
  const barLabel = `${pct}% of portfolio at greater than or equal to 65 percent spend`

  return (
    <section className="spend-kpi-strip" aria-label="Spend breakdown and funding summary">
      <div className="spend-kpi-strip__grid">
        <div className="spend-kpi-strip__cell spend-kpi-strip__cell--breakdown">
          <p className="spend-kpi-strip__label" id="spend-kpi-breakdown-heading">
            Spend breakdown
          </p>
          <div className="spend-kpi-strip__breakdown-hbar" role="group" aria-label={barLabel}>
            <div className="spend-kpi-strip__hbar-metric-row">
              <div className="spend-kpi-strip__hbar-track">
                <div
                  className="spend-kpi-strip__hbar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="spend-kpi-strip__metric spend-kpi-strip__metric--primary-pct">{pct}%</p>
            </div>
            <p className="spend-kpi-strip__sub">≥ 65%</p>
          </div>
        </div>

        <span className="spend-kpi-strip__divider" aria-hidden />

        <div className="spend-kpi-strip__cell">
          <p className="spend-kpi-strip__label" id="spend-kpi-gap-heading">
            Funding gap
          </p>
          <p className="spend-kpi-strip__metric spend-kpi-strip__metric--header" aria-labelledby="spend-kpi-gap-heading">
            $854K
          </p>
          <p className="spend-kpi-strip__sub">50 contracts unfunded</p>
        </div>

        <span className="spend-kpi-strip__divider" aria-hidden />

        <div className="spend-kpi-strip__cell">
          <p className="spend-kpi-strip__label" id="spend-kpi-balance-heading">
            Unspent balance
          </p>
          <p className="spend-kpi-strip__metric spend-kpi-strip__metric--header" aria-labelledby="spend-kpi-balance-heading">
            $1598K
          </p>
          <p className="spend-kpi-strip__sub">expires if not renewed</p>
        </div>
      </div>
    </section>
  )
}
