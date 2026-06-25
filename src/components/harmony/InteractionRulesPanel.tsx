import './InteractionRulesPanel.css'

const RULE_SECTIONS = [
  {
    title: 'KPI cards',
    items: [
      'Click an expiry card (30 / 31–60 / 61–90 days) to filter the table to contracts in that window.',
      'Expiry filters include every contract in the window, regardless of funding used.',
      'Click Funding used > 65% to show only contracts above the threshold.',
      'Click the same card again to clear the filter.',
      'Click outside the KPI row and table to clear the filter.',
    ],
  },
  {
    title: 'Table sort',
    items: [
      'When an expiry card is selected, rows sort by soonest contract end date.',
      'When Funding used > 65% is selected, rows sort by highest funding used first.',
      'With no filter, rows sort by soonest contract end date.',
    ],
  },
  {
    title: 'Table rows',
    items: [
      'Click a row to open the contract detail panel on the right.',
      'Use the chevron in Contract Info to expand project lines under a contract.',
      'Press Escape or close the panel to deselect the row.',
    ],
  },
  {
    title: 'Color cues',
    items: [
      'Red — expires within 30 days (KPI accent and count).',
      'Terracotta — expires in 31–60 days.',
      'Blue — expires in 61–90 days.',
      'Gold — funding used > 65% KPI card.',
      'Red funding value in the table — contract funding used is 65% or higher.',
      'Default text — funding used is below 65%.',
    ],
  },
] as const

export function InteractionRulesPanel() {
  return (
    <div className="interaction-rules-panel">
      <p className="interaction-rules-panel__intro">
        Command Center mockup — how KPI cards, filters, and colors behave.
      </p>
      {RULE_SECTIONS.map((section) => (
        <section key={section.title} className="interaction-rules-panel__section">
          <h3 className="interaction-rules-panel__heading">{section.title}</h3>
          <ul className="interaction-rules-panel__list">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
