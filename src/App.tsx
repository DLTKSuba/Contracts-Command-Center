import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Routes, Route } from 'react-router-dom'
import { ShellLayout } from './components/harmony/ShellLayout'
import type { ShellLayoutProps } from './components/harmony/ShellLayout'
import { Card } from './components/harmony/Card'
import { Button } from './components/harmony/Button'
import { TabStrip } from './components/harmony/TabStrip'
import { Table } from './components/harmony/Table'
import {
  ContractsExpirationDashboard,
  type ExpirationTierKey,
} from './components/harmony/ContractsExpirationDashboard'
import { SpendSignalsKpiStrip } from './components/harmony/SpendSignalsKpiStrip'
import { Link } from './components/harmony/Link'
import { Icon } from './components/harmony/Icon'
import { ComponentGalleryPage } from './pages/ComponentGalleryPage'
import { ComponentDemoPage } from './pages/ComponentDemoPage'
import { RightSidebarPanelDemosPage } from './pages/RightSidebarPanelDemosPage'

/** Default product theme for the designer preview (change via document.documentElement.classList if needed). */
const DEFAULT_THEME = 'theme-cp'

/**
 * Per-theme ShellLayout prop defaults.
 * When DEFAULT_THEME changes, HomeShell automatically picks up the correct
 * footer visibility, floating nav, sidebar variant, product name, and logo.
 */
const THEME_SHELL_PROPS: Record<string, Partial<ShellLayoutProps>> = {
  'theme-cp': {
    productName: 'CP',
    logoSrc: '/logos/CPVPLogo.svg',
    showFooter: false,
    showFloatingNav: true,
    leftSidebarVariant: 'cp',
    rightSidebarVariant: 'cp',
  },
  'theme-vp': {
    productName: 'VP',
    logoSrc: '/logos/CPVPLogo.svg',
    showFooter: true,
    leftSidebarVariant: 'vp',
    rightSidebarVariant: 'vp',
  },
  'theme-ppm': {
    productName: 'PPM',
    logoSrc: '/logos/PPMLogo.svg',
    showFooter: true,
    leftSidebarVariant: 'ppm',
    rightSidebarVariant: 'ppm',
  },
  'theme-maconomy': {
    productName: 'Maconomy',
    logoSrc: '/logos/MacLogo.svg',
    showFooter: true,
    leftSidebarVariant: 'maconomy',
    rightSidebarVariant: 'maconomy',
  },
}

const REQ_MAIN_TAB_IDS = ['requisitions', 'purchase-orders'] as const

const PO_DETAIL_TAB_PREFIX = 'po-detail:' as const

function poDetailTabId(poId: string) {
  return `${PO_DETAIL_TAB_PREFIX}${poId}`
}

function isPoDetailTabId(id: string) {
  return id.startsWith(PO_DETAIL_TAB_PREFIX)
}

function poIdFromDetailTabId(id: string): string | null {
  if (!isPoDetailTabId(id)) return null
  return id.slice(PO_DETAIL_TAB_PREFIX.length)
}

const PR_DETAIL_TAB_PREFIX = 'pr-detail:' as const

function prDetailTabId(prId: string) {
  return `${PR_DETAIL_TAB_PREFIX}${prId}`
}

function isPrDetailTabId(id: string) {
  return id.startsWith(PR_DETAIL_TAB_PREFIX)
}

function prIdFromDetailTabId(id: string): string | null {
  if (!isPrDetailTabId(id)) return null
  return id.slice(PR_DETAIL_TAB_PREFIX.length)
}

type RequisitionRow = {
  id: string
  vendorId: string
  vendor: string
  amount: string
  /** Next milestone / review date (Command Center grid). */
  nextImportantDate: string
  /** Contract effective start. */
  startDate: string
  /** Funded (commitment) value. */
  fundedValue: string
  /** Incurred to date cost. */
  itdCost: string
  /** ITD as % of funded (0–100+). */
  fundingPercent: number
  statusLabel: string
  stageIndices: readonly number[]
  overdue: string
  overdueUrgent?: boolean
  requestedBy: string
  organization: string
  createdDate: string
  needBy: string
  /** Optional copy for the yellow stat strip above Summary (empty hides the line). */
  bannerMessage: string
  /** Lines assigned to the logged-in buyer (Summary). */
  buyerAssignedLineCount: number
  /** Late lines per lifecycle stage for Late Items panel (indices match REQ_STATUS_STAGE_LABELS). */
  lateItemsStageCounts: readonly [number, number, number, number]
  requisitionerName: string
  requisitionerEmail: string
  /** Days until contract end (Command Center expiry tiers & filters). */
  daysUntilContractExpiry: number
}

type RequisitionLineRow = {
  line: string
  status: string
  projectId: string
  projectName: string
  item: string
  rev: string
  itemDesc: string
  lnStatus: string
  preferredVendor: string
  targetPlaceDate: string
  daysUntilTarget: number
  nextApprover: string
  qty: string
  unitCost: string
  lineTotalCost: string
  accountId: string
  accountName: string
  orgId: string
  orgName: string
}

const REQUISITION_ROWS: RequisitionRow[] = [
  {
    id: 'PR-2041',
    vendorId: 'VND-900101',
    vendor: 'Acme Office Supplies',
    amount: '$1,250.00',
    nextImportantDate: 'Apr 12, 2025',
    startDate: 'Apr 2, 2025',
    fundedValue: '$5,000.00',
    itdCost: '$1,900.00',
    fundingPercent: 38,
    statusLabel: 'Pending Approval',
    stageIndices: [0, 2],
    overdue: '2/5',
    overdueUrgent: true,
    requestedBy: 'Alex Rivera',
    organization: 'HQ — Procurement',
    createdDate: 'Apr 2, 2025',
    needBy: 'Apr 18, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 4,
    lateItemsStageCounts: [1, 0, 1, 0],
    requisitionerName: 'Jamie Chen',
    requisitionerEmail: 'jamie.chen@contoso.com',
    daysUntilContractExpiry: 48,
  },
  {
    id: 'PR-2045',
    vendorId: 'VND-900205',
    vendor: 'Litware Medical Devices',
    amount: '$3,890.25',
    nextImportantDate: 'Apr 16, 2025',
    startDate: 'Mar 28, 2025',
    fundedValue: '$12,000.00',
    itdCost: '$8,520.00',
    fundingPercent: 71,
    statusLabel: 'Pending Approval',
    stageIndices: [0, 2],
    overdue: '1/6',
    overdueUrgent: true,
    requestedBy: 'Sam Lee',
    organization: 'Region NA — Ops',
    createdDate: 'Mar 28, 2025',
    needBy: 'Apr 22, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 6,
    lateItemsStageCounts: [0, 0, 1, 0],
    requisitionerName: 'Sam Lee',
    requisitionerEmail: 'sam.lee@contoso.com',
    daysUntilContractExpiry: 18,
  },
  {
    id: 'PR-2042',
    vendorId: 'VND-900302',
    vendor: 'Northwind Logistics LLC',
    amount: '$8,420.50',
    nextImportantDate: 'Apr 8, 2025',
    startDate: 'Mar 15, 2025',
    fundedValue: '$25,000.00',
    itdCost: '$22,000.00',
    fundingPercent: 88,
    statusLabel: 'Pending PO Creation',
    stageIndices: [0, 2, 3],
    overdue: '1/4',
    overdueUrgent: true,
    requestedBy: 'Jordan Smith',
    organization: 'HQ — Finance',
    createdDate: 'Mar 15, 2025',
    needBy: 'Apr 10, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 3,
    lateItemsStageCounts: [0, 0, 0, 1],
    requisitionerName: 'Jordan Smith',
    requisitionerEmail: 'jordan.smith@contoso.com',
    daysUntilContractExpiry: 52,
  },
  {
    id: 'PR-2048',
    vendorId: 'VND-900448',
    vendor: 'Wide World Importers',
    amount: '$22,150.00',
    nextImportantDate: 'Apr 3, 2025',
    startDate: 'Mar 20, 2025',
    fundedValue: '$48,000.00',
    itdCost: '$39,360.00',
    fundingPercent: 82,
    statusLabel: 'Pending PO Creation',
    stageIndices: [0, 2, 3],
    overdue: '4/9',
    overdueUrgent: true,
    requestedBy: 'Priya Nair',
    organization: 'EMEA — Supply',
    createdDate: 'Mar 20, 2025',
    needBy: 'Apr 5, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 5,
    lateItemsStageCounts: [1, 0, 2, 1],
    requisitionerName: 'Priya Nair',
    requisitionerEmail: 'priya.nair@contoso.com',
    daysUntilContractExpiry: 12,
  },
  {
    id: 'PR-2043',
    vendorId: 'VND-900503',
    vendor: 'Contoso Training Group',
    amount: '$2,100.00',
    nextImportantDate: 'Apr 18, 2025',
    startDate: 'Apr 8, 2025',
    fundedValue: '$8,000.00',
    itdCost: '$3,600.00',
    fundingPercent: 45,
    statusLabel: 'Pending Submittal',
    stageIndices: [0],
    overdue: '1/3',
    overdueUrgent: true,
    requestedBy: 'Morgan Chen',
    organization: 'HQ — L&D',
    createdDate: 'Apr 8, 2025',
    needBy: 'Apr 25, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 2,
    lateItemsStageCounts: [1, 0, 0, 0],
    requisitionerName: 'Morgan Chen',
    requisitionerEmail: 'morgan.chen@contoso.com',
    daysUntilContractExpiry: 44,
  },
  {
    id: 'PR-2046',
    vendorId: 'VND-900606',
    vendor: 'Adventure Works IT',
    amount: '$475.90',
    nextImportantDate: 'Apr 22, 2025',
    startDate: 'Apr 1, 2025',
    fundedValue: '$3,500.00',
    itdCost: '$980.00',
    fundingPercent: 28,
    statusLabel: 'Pending Submittal',
    stageIndices: [0],
    overdue: '0/2',
    requestedBy: 'Casey Brooks',
    organization: 'IT — Infrastructure',
    createdDate: 'Apr 1, 2025',
    needBy: 'Apr 30, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 1,
    lateItemsStageCounts: [0, 0, 0, 0],
    requisitionerName: 'Casey Brooks',
    requisitionerEmail: 'casey.brooks@contoso.com',
    daysUntilContractExpiry: 75,
  },
  {
    id: 'PR-2044',
    vendorId: 'VND-900704',
    vendor: 'Fabrikam Facilities Inc.',
    amount: '$640.00',
    nextImportantDate: 'Feb 28, 2025',
    startDate: 'Feb 10, 2025',
    fundedValue: '$4,200.00',
    itdCost: '$2,310.00',
    fundingPercent: 55,
    statusLabel: 'Rejected',
    stageIndices: [0, 1],
    overdue: '1/2',
    overdueUrgent: true,
    requestedBy: 'Riley Ortiz',
    organization: 'Facilities — West',
    createdDate: 'Feb 10, 2025',
    needBy: 'Mar 1, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 0,
    lateItemsStageCounts: [0, 1, 0, 0],
    requisitionerName: 'Riley Ortiz',
    requisitionerEmail: 'riley.ortiz@contoso.com',
    daysUntilContractExpiry: 85,
  },
  {
    id: 'PR-2047',
    vendorId: 'VND-900807',
    vendor: 'Blue Yonder Analytics',
    amount: '$9,999.00',
    nextImportantDate: 'Feb 15, 2025',
    startDate: 'Jan 22, 2025',
    fundedValue: '$35,000.00',
    itdCost: '$32,200.00',
    fundingPercent: 92,
    statusLabel: 'Rejected',
    stageIndices: [0, 2, 1],
    overdue: '3/3',
    overdueUrgent: true,
    requestedBy: 'Taylor Kim',
    organization: 'HQ — Analytics',
    createdDate: 'Jan 22, 2025',
    needBy: 'Feb 28, 2025',
    bannerMessage: '',
    buyerAssignedLineCount: 8,
    lateItemsStageCounts: [0, 1, 1, 1],
    requisitionerName: 'Taylor Kim',
    requisitionerEmail: 'taylor.kim@contoso.com',
    daysUntilContractExpiry: 8,
  },
]

const DEFAULT_EXPIRY_MAX_DAYS = 90

function parseUsd(value: string): number {
  const n = Number(value.replace(/[$,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatCurrencyCompact(amount: number): string {
  const abs = Math.abs(amount)
  if (abs >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(amount / 1_000).toFixed(2)}K`
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function matchesExpiryTier(row: RequisitionRow, tier: ExpirationTierKey): boolean {
  const d = row.daysUntilContractExpiry
  if (tier === 'critical') return d <= 30
  if (tier === 'warning') return d >= 31 && d <= 60
  return d >= 61 && d <= 90
}

function filterRowsByExpirySelection(
  rows: RequisitionRow[],
  selectedTier: ExpirationTierKey | null,
): RequisitionRow[] {
  const withinDefault = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  if (selectedTier == null) return withinDefault
  return withinDefault.filter((r) => matchesExpiryTier(r, selectedTier))
}

function summarizeExpirationTierCounts(rows: RequisitionRow[]): {
  critical: number
  warning: number
  upcoming: number
} {
  const base = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  return {
    critical: base.filter((r) => r.daysUntilContractExpiry <= 30).length,
    warning: base.filter((r) => r.daysUntilContractExpiry >= 31 && r.daysUntilContractExpiry <= 60).length,
    upcoming: base.filter((r) => r.daysUntilContractExpiry >= 61 && r.daysUntilContractExpiry <= 90).length,
  }
}

function computeSpendMetricsFromRows(rows: RequisitionRow[]) {
  if (rows.length === 0) {
    return {
      highSpendGe65Pct: 0,
      fundedValueLabel: '$0.00',
      fundingGapLabel: '$0.00',
      unspentBalanceLabel: '$0.00',
    }
  }
  const highSpend = rows.filter((r) => r.fundingPercent >= 65).length
  const pct = Math.round((highSpend / rows.length) * 1000) / 10
  let fundedSum = 0
  let itdSum = 0
  for (const r of rows) {
    fundedSum += parseUsd(r.fundedValue)
    itdSum += parseUsd(r.itdCost)
  }
  const unspent = Math.max(0, fundedSum - itdSum)
  const gapDemo = Math.max(0, fundedSum * 0.052)
  return {
    highSpendGe65Pct: pct,
    fundedValueLabel: formatCurrencyCompact(fundedSum),
    fundingGapLabel: formatCurrencyCompact(gapDemo),
    unspentBalanceLabel: formatCurrencyCompact(unspent),
  }
}

function requisitionLineRowsForPr(row: RequisitionRow): RequisitionLineRow[] {
  const preferredVendor = `${row.vendorId} — ${row.vendor}`
  const lineCount = Math.max(10, row.buyerAssignedLineCount)
  return Array.from({ length: lineCount }, (_, i) => {
    const n = i + 1
    const statusEmpty = n === 2
    const qty = n + 1
    const unit = 125.5 * n
    const total = unit * qty
    const itemDescShort =
      n === 1
        ? `Workstation bundle — ${row.vendor}`
        : n % 3 === 0
          ? 'Office supplies kit — catalog'
          : 'Standard hardware line — non-stock'
    return {
      line: String(n),
      status: statusEmpty ? '' : n === 1 ? 'Pending Approval' : 'Buyer Review',
      projectId: `PRJ-${2400 + n}`,
      projectName: n % 2 === 0 ? 'HQ Facilities Refresh' : 'Field Services Expansion',
      item: `ITM-${row.id.replace(/^PR-/, '')}-${String(n).padStart(2, '0')}`,
      rev: n === 1 ? 'A' : 'B',
      itemDesc: itemDescShort,
      lnStatus: n === 1 ? 'Open' : 'Submitted',
      preferredVendor,
      targetPlaceDate: row.needBy,
      daysUntilTarget: 22 - n * 7,
      nextApprover: n === 1 ? row.requestedBy : 'Jamie Chen',
      qty: String(qty),
      unitCost: `$${unit.toFixed(2)}`,
      lineTotalCost: `$${total.toFixed(2)}`,
      accountId: 'ACC-4400',
      accountName: 'Operating Expense',
      orgId: 'ORG-HQ',
      orgName: row.organization,
    }
  })
}

function requisitionReportHref(prId: string) {
  return `#/report/requisition/${encodeURIComponent(prId)}`
}

/** Parses table overdue cell like `2/5` → late vs total counts. */
function parseOverdueFraction(overdue: string): { late: number; total: number } | null {
  const m = /^(\d+)\s*\/\s*(\d+)$/.exec(overdue.trim())
  if (!m) return null
  const late = Number(m[1])
  const total = Number(m[2])
  if (!Number.isFinite(late) || !Number.isFinite(total) || total <= 0) return null
  return { late, total }
}

/** Parses table overdue cell like `2/5` → 40% for the side panel. */
function overdueLinesPercent(overdue: string): number | null {
  const p = parseOverdueFraction(overdue)
  if (!p) return null
  return Math.round((p.late / p.total) * 100)
}

/** Bar colors aligned with PO Command Center reference; requisitions use the first four tones. */
const REQ_LIFECYCLE_COLORS = {
  pendingSubmittal: '#f97316',
  rejected: '#dc2626',
  pendingApproval: '#ec4899',
  pendingPoCreation: '#1d4ed8',
} as const

/** Stage index order matches status columns left → right (see REQ_STATUS_STAGE_LABELS). */
const REQ_STATUS_DOT_COLORS = [
  REQ_LIFECYCLE_COLORS.pendingSubmittal,
  REQ_LIFECYCLE_COLORS.rejected,
  REQ_LIFECYCLE_COLORS.pendingApproval,
  REQ_LIFECYCLE_COLORS.pendingPoCreation,
] as const

const REQ_STATUS_STAGE_LABELS = [
  'Pending Submittal',
  'Rejected',
  'Pending Approval',
  'Pending PO Creation',
] as const

function contractInfoCell(row: RequisitionRow) {
  return (
    <td className="command-center-contract-info">
      <span className="command-center-contract-info__id">{row.id}</span>
      <span className="command-center-contract-info__vendor">{row.vendor}</span>
    </td>
  )
}

function contractActionsCell(row: RequisitionRow) {
  return (
    <td
      className="command-center-actions-cell text-right"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="command-center-actions-cell__inner">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon="ellipsis-horizontal"
          ariaLabel={`More actions for ${row.id}`}
        />
      </div>
    </td>
  )
}

function commandCenterHeaderTh(
  label: string,
  align: 'left' | 'right' = 'left',
  title?: string,
  showChrome = true,
) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  const icons = showChrome ? (
    <span className="command-center-th__actions" aria-hidden>
      <Icon name="chevron-up-down" size="xs" />
      <Icon name="funnel" size="xs" />
    </span>
  ) : null
  return (
    <th className={alignClass} scope="col" title={title}>
      <span
        className={
          align === 'right'
            ? 'command-center-th command-center-th--end'
            : 'command-center-th'
        }
      >
        <span className="command-center-th__label">{label}</span>
        {icons}
      </span>
    </th>
  )
}

const REQUISITION_TABLE_HEADER = (
  <thead>
    <tr>
      {commandCenterHeaderTh('Contract Info')}
      {commandCenterHeaderTh('Next Important Date')}
      {commandCenterHeaderTh('Start Date')}
      {commandCenterHeaderTh('End Date')}
      {commandCenterHeaderTh('Contract Value', 'right')}
      {commandCenterHeaderTh('Funded Value', 'right')}
      {commandCenterHeaderTh('ITD Cost', 'right')}
      {commandCenterHeaderTh('Funding %', 'right')}
      {commandCenterHeaderTh('Actions', 'right', undefined, false)}
    </tr>
  </thead>
)

const PR_LINE_DETAILS_TABLE_HEADER = (
  <thead>
    <tr>
      {commandCenterHeaderTh('Line')}
      {commandCenterHeaderTh('Status')}
      {commandCenterHeaderTh('Projects')}
      {commandCenterHeaderTh('Item')}
      {commandCenterHeaderTh('Rev')}
      {commandCenterHeaderTh('Item Desc')}
      {commandCenterHeaderTh('Ln Status')}
      {commandCenterHeaderTh('Preferred Vendor')}
      {commandCenterHeaderTh('Target Place date')}
      {commandCenterHeaderTh('Days Until Target Place Date', 'right')}
      {commandCenterHeaderTh('Next Approver')}
      {commandCenterHeaderTh('Qty', 'right')}
      {commandCenterHeaderTh('Unit Cost', 'right')}
      {commandCenterHeaderTh('Line Total Cost', 'right')}
      {commandCenterHeaderTh('Accounts')}
      {commandCenterHeaderTh('Orgs')}
    </tr>
  </thead>
)

function PrLineDetailsTableBody({ rows }: { rows: RequisitionLineRow[] }) {
  const cell = 'command-center-pr-line-details-table__cell'
  return (
    <tbody>
      {rows.map((r) => (
        <tr key={`${r.line}-${r.item}`}>
          <td className={clsx('text-left', cell)}>{r.line}</td>
          <td className={clsx('text-left', cell)}>{r.status ? r.status : '\u00A0'}</td>
          <td className={clsx('text-left', cell)}>
            {r.projectId} — {r.projectName}
          </td>
          <td className={clsx('text-left', cell)}>{r.item}</td>
          <td className={clsx('text-left', cell)}>{r.rev}</td>
          <td className={clsx('text-left', cell)}>{r.itemDesc}</td>
          <td className={clsx('text-left', cell)}>{r.lnStatus}</td>
          <td className={clsx('text-left', cell)}>{r.preferredVendor}</td>
          <td className={clsx('text-left', cell)}>{r.targetPlaceDate}</td>
          <td
            className={clsx('text-right', cell)}
            style={r.daysUntilTarget < 0 ? { color: 'var(--color-error)' } : undefined}
          >
            {r.daysUntilTarget}
          </td>
          <td className={clsx('text-left', cell)}>{r.nextApprover}</td>
          <td className={clsx('text-right', cell)}>{r.qty}</td>
          <td className={clsx('text-right', cell)}>{r.unitCost}</td>
          <td className={clsx('text-right', cell)}>{r.lineTotalCost}</td>
          <td className={clsx('text-left', cell)}>
            {r.accountId} — {r.accountName}
          </td>
          <td className={clsx('text-left', cell)}>
            {r.orgId} — {r.orgName}
          </td>
        </tr>
      ))}
    </tbody>
  )
}

function RequisitionTableBody({
  rows,
  selectedId,
  onSelectRow,
}: {
  rows: RequisitionRow[]
  selectedId: string | null
  onSelectRow: (id: string) => void
}) {
  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          className={clsx(
            'command-center-table-row--selectable',
            selectedId === row.id && 'table-row--selected',
          )}
          tabIndex={0}
          aria-selected={selectedId === row.id ? 'true' : 'false'}
          onClick={() => onSelectRow(row.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectRow(row.id)
            }
          }}
        >
          {contractInfoCell(row)}
          <td>{row.nextImportantDate}</td>
          <td>{row.startDate}</td>
          <td>{row.needBy}</td>
          <td className="text-right">{row.amount}</td>
          <td className="text-right">{row.fundedValue}</td>
          <td className="text-right">{row.itdCost}</td>
          <td
            className="text-right"
            style={{
              color:
                row.fundingPercent >= 90
                  ? 'var(--color-error)'
                  : row.fundingPercent >= 75
                    ? '#d97706'
                    : undefined,
            }}
          >
            {row.fundingPercent}%
          </td>
          {contractActionsCell(row)}
        </tr>
      ))}
    </tbody>
  )
}

function RequisitionSidePanel({
  row,
  onClose,
  onOpenRequisitionReportTab,
  summaryAccordionOpen,
  onSummaryAccordionOpenChange,
  lateItemsAccordionOpen,
  onLateItemsAccordionOpenChange,
}: {
  row: RequisitionRow
  onClose: () => void
  onOpenRequisitionReportTab: (prId: string) => void
  summaryAccordionOpen: boolean
  onSummaryAccordionOpenChange: (open: boolean) => void
  lateItemsAccordionOpen: boolean
  onLateItemsAccordionOpenChange: (open: boolean) => void
}) {
  const reportHref = requisitionReportHref(row.id)
  const frac = parseOverdueFraction(row.overdue)
  const overduePct = overdueLinesPercent(row.overdue)
  return (
    <aside
      className="command-center-requisition-panel"
      aria-label={`Requisition details for ${row.id}`}
      aria-labelledby="cc-req-panel-title"
    >
      <header className="command-center-requisition-panel__header">
        <h2 className="command-center-requisition-panel__title" id="cc-req-panel-title">
          Purchase Requisitions
        </h2>
        <button
          type="button"
          className="command-center-requisition-panel__close"
          aria-label="Close panel"
          onClick={onClose}
        >
          <Icon name="x-mark" size="sm" />
        </button>
      </header>
      <div className="command-center-requisition-panel__intro">
        <div className="command-center-requisition-panel__pr-row">
          <span className="command-center-requisition-panel__pr-id">{row.id}</span>
          <Link
            href={reportHref}
            size="small"
            title="Open Purchase Requisition Report in a Command Center tab"
            onClick={(e) => {
              e.preventDefault()
              onOpenRequisitionReportTab(row.id)
            }}
          >
            Purchase Requisition Report
          </Link>
        </div>
      </div>
      <div className="command-center-requisition-panel__overdue-strip">
        <div
          className="command-center-requisition-panel__stat-callout"
          aria-label={(() => {
            const base =
              frac != null && overduePct != null
                ? `Overdue lines ${frac.late} of ${frac.total}, ${overduePct} percent`
                : `Overdue lines ${row.overdue}`
            const extra = row.bannerMessage.trim()
            return extra !== '' ? `${base}. ${extra}` : base
          })()}
        >
          <p className="command-center-requisition-panel__stat-callout-pct">
            {overduePct != null ? `${overduePct}%` : row.overdue}
          </p>
          <p className="command-center-requisition-panel__stat-callout-label">Overdue lines</p>
          {row.bannerMessage.trim() !== '' && (
            <p className="command-center-requisition-panel__stat-callout-desc">{row.bannerMessage}</p>
          )}
        </div>
      </div>
      <div className="command-center-requisition-panel__body">
        <RequisitionDetailSummary
          row={row}
          open={summaryAccordionOpen}
          onOpenChange={onSummaryAccordionOpenChange}
        />
        <RequisitionLateItemsSection
          row={row}
          open={lateItemsAccordionOpen}
          onOpenChange={onLateItemsAccordionOpenChange}
        />
      </div>
    </aside>
  )
}

const SUMMARY_LINES_LABEL_TITLE =
  'Only lines assigned to the logged in Buyer' as const

function RequisitionDetailSummary({
  row,
  open,
  onOpenChange,
}: {
  row: RequisitionRow
  open: boolean
  onOpenChange: (next: boolean) => void
}) {
  const mailtoHref = `mailto:${row.requisitionerEmail}`

  return (
    <details
      className="command-center-requisition-accordion"
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary className="command-center-requisition-accordion__summary">
        <span className="command-center-requisition-accordion__summary-main">
          <Icon
            name="chevron-right"
            size="sm"
            className="command-center-requisition-accordion__expand-icon"
            aria-hidden
          />
          <span className="command-center-requisition-accordion__summary-text">Summary</span>
        </span>
      </summary>
      <div className="command-center-requisition-accordion__content">
        <div className="command-center-requisition-summary__grid">
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">PR ID</div>
            <div className="command-center-requisition-summary__value">{row.id}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Preferred Vendor Name</div>
            <div className="command-center-requisition-summary__value">{row.vendor}</div>
          </div>
          <div className="command-center-requisition-summary__field" title={SUMMARY_LINES_LABEL_TITLE}>
            <div className="command-center-requisition-summary__label">No. of Lines</div>
            <div className="command-center-requisition-summary__value">{row.buyerAssignedLineCount}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Requisitioner Name</div>
            <div className="command-center-requisition-summary__value">
              <Link
                href={mailtoHref}
                size="medium"
                title={row.requisitionerEmail}
                aria-label={`Email ${row.requisitionerName} at ${row.requisitionerEmail}`}
              >
                {row.requisitionerName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </details>
  )
}

function RequisitionLateItemsSection({
  row,
  open,
  onOpenChange,
}: {
  row: RequisitionRow
  open: boolean
  onOpenChange: (next: boolean) => void
}) {
  const frac = parseOverdueFraction(row.overdue)
  const lateStatusEntries = row.lateItemsStageCounts
    .map((count, stageIndex) => ({ count, stageIndex }))
    .filter(({ count }) => count > 0)

  return (
    <details
      className="command-center-requisition-accordion"
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary className="command-center-requisition-accordion__summary">
        <span className="command-center-requisition-accordion__summary-main">
          <Icon
            name="chevron-right"
            size="sm"
            className="command-center-requisition-accordion__expand-icon"
            aria-hidden
          />
          <span className="command-center-requisition-accordion__summary-text">Late Items</span>
        </span>
      </summary>
      <div className="command-center-requisition-accordion__content">
        <div className="command-center-requisition-late-items">
          <div
            className="command-center-requisition-late-items__vs-value"
            aria-label={frac != null ? `Late ${frac.late} of ${frac.total} lines` : `Overdue lines ${row.overdue}`}
          >
            {frac != null ? (
              <>
                <span className="command-center-requisition-late-items__vs-segment">
                  <span className="command-center-requisition-late-items__vs-num command-center-requisition-late-items__vs-num--overdue">
                    {frac.late}
                  </span>
                  <sub className="command-center-requisition-late-items__vs-sub">Overdue</sub>
                </span>
                <span className="command-center-requisition-late-items__vs-divider" aria-hidden />
                <span className="command-center-requisition-late-items__vs-segment">
                  <span className="command-center-requisition-late-items__vs-num command-center-requisition-late-items__vs-num--total">
                    {frac.total}
                  </span>
                  <sub className="command-center-requisition-late-items__vs-sub">Total</sub>
                </span>
              </>
            ) : (
              row.overdue.trim()
            )}
          </div>
          {lateStatusEntries.length > 0 && (
            <div className="command-center-requisition-late-items__sections" role="list">
              {lateStatusEntries.map(({ count, stageIndex }) => {
                const label = REQ_STATUS_STAGE_LABELS[stageIndex] ?? `Stage ${stageIndex}`
                const color = REQ_STATUS_DOT_COLORS[stageIndex] ?? '#94a3b8'
                return (
                  <section
                    key={label}
                    className="command-center-requisition-late-items__status-section"
                    role="listitem"
                    aria-label={`${label}, ${count} overdue lines`}
                  >
                    <div className="command-center-requisition-late-items__status-section-inner">
                      <div className="command-center-requisition-late-items__status-top-row">
                        <div className="command-center-requisition-late-items__status-title-row">
                          <span
                            className="command-center-requisition-late-items__swatch"
                            style={{ backgroundColor: color }}
                            aria-hidden
                          />
                          <span className="command-center-requisition-late-items__status-name">{label}</span>
                        </div>
                        <Link
                          href="#"
                          size="medium"
                          className="command-center-requisition-late-items__followup"
                          title={`Follow up on ${label}`}
                          aria-label={`Follow up on ${label}`}
                          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault()
                          }}
                        >
                          Follow up
                        </Link>
                      </div>
                      <div className="command-center-requisition-late-items__status-count-below">{count}</div>
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </details>
  )
}

type PoOrderSummaryFields = {
  release: string
  buyer: string
  type: string
  numberOfLines: number
  vendorName: string
  dueDate: string
  dpasRating: string
}

/** PR Summary fields for order detail (reference layout). */
const PO_ORDER_SUMMARY_BY_ID: Record<string, PoOrderSummaryFields> = {
  'PO-1039': {
    release: 'REL-2024-001',
    buyer: 'John Smith',
    type: 'Standard',
    numberOfLines: 24,
    vendorName: 'Industrial Supply Co.',
    dueDate: '11/15/2024',
    dpasRating: 'Y',
  },
  'PO-1040': {
    release: 'REL-2024-014',
    buyer: 'Alex Rivera',
    type: 'Blanket',
    numberOfLines: 12,
    vendorName: 'Northwind Logistics',
    dueDate: '12/02/2024',
    dpasRating: 'N',
  },
  'PO-1041': {
    release: 'REL-2024-022',
    buyer: 'Priya Nair',
    type: 'Sub Contract',
    numberOfLines: 8,
    vendorName: 'Contoso Services',
    dueDate: '01/08/2025',
    dpasRating: 'Y',
  },
}

function PoOrderPrSummaryAccordion({ poId }: { poId: string }) {
  const summary = PO_ORDER_SUMMARY_BY_ID[poId] ?? PO_ORDER_SUMMARY_BY_ID['PO-1039']
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(true)
  }, [poId])

  return (
    <details
      className="command-center-requisition-accordion"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="command-center-requisition-accordion__summary">
        <span className="command-center-requisition-accordion__summary-main">
          <Icon
            name="chevron-right"
            size="sm"
            className="command-center-requisition-accordion__expand-icon"
            aria-hidden
          />
          <span className="command-center-requisition-accordion__summary-text">PR Summary: {poId}</span>
        </span>
      </summary>
      <div className="command-center-requisition-accordion__content">
        <div className="command-center-requisition-summary__grid">
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Release</div>
            <div className="command-center-requisition-summary__value">{summary.release}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Buyer</div>
            <div className="command-center-requisition-summary__value">{summary.buyer}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Type</div>
            <div className="command-center-requisition-summary__value">{summary.type}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Number of Lines</div>
            <div className="command-center-requisition-summary__value">{summary.numberOfLines}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Vendor Name</div>
            <div className="command-center-requisition-summary__value">{summary.vendorName}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">Due Date</div>
            <div className="command-center-requisition-summary__value">{summary.dueDate}</div>
          </div>
          <div className="command-center-requisition-summary__field">
            <div className="command-center-requisition-summary__label">DPAS Rating</div>
            <div className="command-center-requisition-summary__value">{summary.dpasRating}</div>
          </div>
        </div>
      </div>
    </details>
  )
}

function PoOrderDetailView({ poId }: { poId: string }) {
  return (
    <div className="command-center-order-detail">
      <PoOrderPrSummaryAccordion poId={poId} />
      <div className="command-center-order-detail__line-details">
        <h2 className="command-center-order-detail__section-title">Line Details</h2>
        <p className="command-center-order-detail__placeholder">Table rows can be wired to live data next.</p>
      </div>
    </div>
  )
}

function RequisitionDetailsTabView({ prId }: { prId: string }) {
  const row = REQUISITION_ROWS.find((r) => r.id === prId)
  const lineRows = useMemo(() => (row != null ? requisitionLineRowsForPr(row) : []), [row])
  if (row == null) {
    return (
      <div className="command-center-order-detail-wrap">
        <p className="command-center-order-detail__placeholder">Requisition {prId} was not found.</p>
      </div>
    )
  }
  return (
    <section className="command-center-pr-report-section" aria-label="Requisition report">
      <div className="command-center-pr-summary-panel">
        <h2 id="cc-pr-summary-heading" className="command-center-pr-summary-panel__heading">
          PR Summary : {row.id}
        </h2>
        <div className="command-center-pr-summary-panel__row" role="group" aria-label="Requisition summary fields">
          <div className="command-center-pr-summary-panel__cell">
            <div className="command-center-pr-summary-panel__label">PR ID</div>
            <div className="command-center-pr-summary-panel__value">{row.id}</div>
          </div>
          <div className="command-center-pr-summary-panel__cell">
            <div className="command-center-pr-summary-panel__label">Preferred Vendor</div>
            <div className="command-center-pr-summary-panel__value">
              {row.vendorId} — {row.vendor}
            </div>
          </div>
          <div className="command-center-pr-summary-panel__cell">
            <div className="command-center-pr-summary-panel__label">No. of Lines</div>
            <div className="command-center-pr-summary-panel__value">{row.buyerAssignedLineCount}</div>
          </div>
          <div className="command-center-pr-summary-panel__cell">
            <div className="command-center-pr-summary-panel__label">Target Place Date</div>
            <div className="command-center-pr-summary-panel__value">{row.needBy}</div>
          </div>
          <div className="command-center-pr-summary-panel__cell">
            <div className="command-center-pr-summary-panel__label">Total Amt</div>
            <div className="command-center-pr-summary-panel__value">{row.amount}</div>
          </div>
        </div>
      </div>

      <div className="command-center-pr-line-details-panel" aria-labelledby="cc-pr-line-details-heading">
        <h2 id="cc-pr-line-details-heading" className="command-center-pr-line-details-panel__heading">
          Line details
        </h2>
        <div className="command-center-pr-line-details-panel__table-scroll">
          <Table
            headerVariant="white"
            striped
            className="command-center-data-table command-center-pr-line-details-table"
            header={PR_LINE_DETAILS_TABLE_HEADER}
            body={<PrLineDetailsTableBody rows={lineRows} />}
          />
        </div>
      </div>
    </section>
  )
}

function HomeShell() {
  const [activeTabId, setActiveTabId] = useState<string>('requisitions')
  const [prDetailRequisitionIds, setPrDetailRequisitionIds] = useState<string[]>([])
  const [poDetailOrderIds, setPoDetailOrderIds] = useState<string[]>([])
  const [refreshTick, setRefreshTick] = useState(0)
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null)
  const [reqPanelSummaryOpen, setReqPanelSummaryOpen] = useState(true)
  const [reqPanelLateItemsOpen, setReqPanelLateItemsOpen] = useState(true)
  const [expirationTierFilter, setExpirationTierFilter] = useState<ExpirationTierKey | null>(null)
  const expirationDashRef = useRef<HTMLDivElement>(null)
  const themeProps = THEME_SHELL_PROPS[DEFAULT_THEME] ?? THEME_SHELL_PROPS['theme-cp']

  const expirationTierCounts = useMemo(() => summarizeExpirationTierCounts(REQUISITION_ROWS), [])

  const filteredRequisitionRows = useMemo(
    () => filterRowsByExpirySelection(REQUISITION_ROWS, expirationTierFilter),
    [expirationTierFilter],
  )

  const spendKpiMetrics = useMemo(
    () => computeSpendMetricsFromRows(filteredRequisitionRows),
    [filteredRequisitionRows],
  )

  const selectedRequisition = useMemo(
    () => filteredRequisitionRows.find((r) => r.id === selectedRequisitionId) ?? null,
    [filteredRequisitionRows, selectedRequisitionId],
  )

  useEffect(() => {
    setReqPanelSummaryOpen(true)
    setReqPanelLateItemsOpen(true)
  }, [selectedRequisitionId])

  useEffect(() => {
    if (selectedRequisitionId == null) return
    if (!filteredRequisitionRows.some((r) => r.id === selectedRequisitionId)) {
      setSelectedRequisitionId(null)
    }
  }, [filteredRequisitionRows, selectedRequisitionId])

  useEffect(() => {
    if (expirationTierFilter === null) return
    const onDocMouseDown = (e: Event) => {
      const el = expirationDashRef.current
      if (el != null && !el.contains(e.target as Node)) {
        setExpirationTierFilter(null)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [expirationTierFilter])

  const openPrRequisitionDetailTab = (prId: string) => {
    setPrDetailRequisitionIds((prev) => (prev.includes(prId) ? prev : [...prev, prId]))
    setActiveTabId(prDetailTabId(prId))
  }

  const closeClosableCommandCenterTab = (tabId: string) => {
    const poId = poIdFromDetailTabId(tabId)
    if (poId != null) {
      setPoDetailOrderIds((prev) => prev.filter((id) => id !== poId))
      setActiveTabId((current) => (current !== tabId ? current : 'requisitions'))
      return
    }
    const prId = prIdFromDetailTabId(tabId)
    if (prId != null) {
      setPrDetailRequisitionIds((prev) => prev.filter((id) => id !== prId))
      setActiveTabId((current) => (current !== tabId ? current : 'requisitions'))
    }
  }

  useEffect(() => {
    if (activeTabId !== 'requisitions' && activeTabId !== 'purchase-orders') {
      setSelectedRequisitionId(null)
    }
  }, [activeTabId])

  useEffect(() => {
    if (selectedRequisitionId == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRequisitionId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedRequisitionId])

  const commandCenterTabs = useMemo(() => {
    const base = REQ_MAIN_TAB_IDS.map((id) => ({
      id,
      label:
        id === 'requisitions'
          ? 'Contracts Expiration Timeline'
          : 'Risk Analysis',
      active: activeTabId === id,
      disabled: id === 'purchase-orders',
      showClose: false as const,
    }))
    const prDetailTabs = prDetailRequisitionIds.map((prId) => {
      const id = prDetailTabId(prId)
      return {
        id,
        label: `Requisition Details : ${prId}`,
        active: activeTabId === id,
        showClose: true as const,
      }
    })
    const poDetailTabs = poDetailOrderIds.map((poId) => {
      const id = poDetailTabId(poId)
      return {
        id,
        label: `Order Details: ${poId}`,
        active: activeTabId === id,
        showClose: true as const,
      }
    })
    return [...base, ...prDetailTabs, ...poDetailTabs]
  }, [activeTabId, prDetailRequisitionIds, poDetailOrderIds])

  return (
    <ShellLayout
      {...themeProps}
      pageHeaderTitle="Command Center"
      pageHeaderShowDefaultButtons={false}
    >
      <Card primary elevated className="command-center-home">
        <div className="card__body">
          <div className="command-center-tab-row">
            <TabStrip
              tabs={commandCenterTabs}
              onTabSelected={(id: string) => {
                if (
                  id === 'requisitions' ||
                  id === 'purchase-orders' ||
                  isPoDetailTabId(id) ||
                  isPrDetailTabId(id)
                ) {
                  setActiveTabId(id)
                }
              }}
              onCloseTab={closeClosableCommandCenterTab}
              overflowMode="none"
              className="tabstrip--command-center-tabs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon="arrow-path"
              ariaLabel="Refresh"
              className="command-center-tab-row__refresh"
              onClick={() => {
                setRefreshTick((t) => t + 1)
              }}
            />
          </div>

          {(activeTabId === 'requisitions' || activeTabId === 'purchase-orders') && (
            <>
              <div ref={expirationDashRef}>
                <ContractsExpirationDashboard
                  key={refreshTick}
                  tierCounts={expirationTierCounts}
                  selectedTier={expirationTierFilter}
                  onSelectTier={setExpirationTierFilter}
                />
              </div>
              <SpendSignalsKpiStrip
                highSpendGe65Pct={spendKpiMetrics.highSpendGe65Pct}
                fundedValueLabel={spendKpiMetrics.fundedValueLabel}
                fundingGapLabel={spendKpiMetrics.fundingGapLabel}
                unspentBalanceLabel={spendKpiMetrics.unspentBalanceLabel}
              />
              <div className="lifecycle-bar-chart__table command-center-table-detail-anchor">
                <div className="command-center-table-detail-stack">
                  <div
                    className="command-center-contracts-table-toolbar"
                    role="toolbar"
                    aria-label="Detail panel sections"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      buttonType="theme"
                      disabled={selectedRequisition == null}
                      className="command-center-contracts-table-toolbar__btn"
                      onClick={() => {
                        setReqPanelSummaryOpen(false)
                        setReqPanelLateItemsOpen(false)
                      }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      buttonType="theme"
                      disabled={selectedRequisition == null}
                      className="command-center-contracts-table-toolbar__btn"
                      onClick={() => {
                        setReqPanelSummaryOpen(true)
                        setReqPanelLateItemsOpen(true)
                      }}
                    >
                      Expand All
                    </Button>
                  </div>
                  <Table
                    headerVariant="white"
                    striped
                    className="command-center-data-table"
                    header={REQUISITION_TABLE_HEADER}
                    body={
                      <RequisitionTableBody
                        rows={filteredRequisitionRows}
                        selectedId={selectedRequisitionId}
                        onSelectRow={setSelectedRequisitionId}
                      />
                    }
                  />
                </div>
                {selectedRequisition != null && (
                  <RequisitionSidePanel
                    row={selectedRequisition}
                    onClose={() => setSelectedRequisitionId(null)}
                    onOpenRequisitionReportTab={openPrRequisitionDetailTab}
                    summaryAccordionOpen={reqPanelSummaryOpen}
                    onSummaryAccordionOpenChange={setReqPanelSummaryOpen}
                    lateItemsAccordionOpen={reqPanelLateItemsOpen}
                    onLateItemsAccordionOpenChange={setReqPanelLateItemsOpen}
                  />
                )}
              </div>
            </>
          )}

          {isPrDetailTabId(activeTabId) && (
            <div className="command-center-order-detail-wrap" key={activeTabId}>
              <RequisitionDetailsTabView prId={prIdFromDetailTabId(activeTabId) ?? ''} />
            </div>
          )}

          {isPoDetailTabId(activeTabId) && (
            <div className="command-center-order-detail-wrap" key={activeTabId}>
              <PoOrderDetailView poId={poIdFromDetailTabId(activeTabId) ?? 'PO-1039'} />
            </div>
          )}
        </div>
      </Card>
    </ShellLayout>
  )
}

function shortBuildStampLabel(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso)
  if (!m) return iso.slice(0, 14)
  return `${m[2]}-${m[3]} ${m[4]}:${m[5]}`
}

/** Tiny on-screen + console proof of which bundle loaded (`vite.config` `__APP_BUILD_ID__`). */
function AppBuildStamp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.info('[Costpoint Command Center] bundle', {
      buildId: __APP_BUILD_ID__,
      mode: import.meta.env.MODE,
    })
  }, [])

  const modeTag = import.meta.env.DEV ? 'dev' : 'prod'
  const short = shortBuildStampLabel(__APP_BUILD_ID__)

  const el = (
    <div
      className="app-build-stamp"
      data-app-build-stamp
      title={`Build: ${__APP_BUILD_ID__}\nMODE: ${import.meta.env.MODE}`}
      aria-label={`Application bundle ${modeTag} ${short}`}
    >
      <span className="app-build-stamp__mode">{modeTag}</span>
      <span className="app-build-stamp__sep" aria-hidden>
        ·
      </span>
      <span className="app-build-stamp__time">{short}</span>
    </div>
  )

  if (!mounted || typeof document === 'undefined') return null
  return createPortal(el, document.body)
}

function App() {
  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-cp',
      'theme-ppm',
      'theme-vp',
      'theme-maconomy',
    )
    document.documentElement.classList.add(DEFAULT_THEME)
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeShell />} />
        <Route path="/components" element={<ComponentGalleryPage />} />
        <Route path="/components/:componentName" element={<ComponentDemoPage />} />
        <Route path="/demos/right-sidebar-panels" element={<RightSidebarPanelDemosPage />} />
      </Routes>
      <AppBuildStamp />
    </>
  )
}

export default App
