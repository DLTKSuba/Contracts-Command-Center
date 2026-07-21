import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Routes, Route } from 'react-router-dom'
import { ShellLayout } from './components/harmony/ShellLayout'
import type { ShellLayoutProps } from './components/harmony/ShellLayout'
import { Card } from './components/harmony/Card'
import { Button } from './components/harmony/Button'
import { Dialog } from './components/harmony/Dialog'
import { InteractionRulesPanel } from './components/harmony/InteractionRulesPanel'
import { TabStrip } from './components/harmony/TabStrip'
import { Table } from './components/harmony/Table'
import {
  ContractsExpirationDashboard,
  VizDesignOptionPicker,
  DailyChartIterationPicker,
  type ExpirationTierKey,
  type ExpiryTierContract,
  type FundingUtilizationSummary,
  type HighFundingLine,
  type TierExpiryLine,
  type VizDesignOption,
  type DailyChartIteration,
} from './components/harmony/ContractsExpirationDashboard'
import { Link } from './components/harmony/Link'
import { Icon } from './components/harmony/Icon'
import { Input } from './components/harmony/Input'
import { Textarea } from './components/harmony/Textarea'
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
    logoSrc: '/logos/CostpointLogo.png',
    logoWordmark: true,
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

const REQ_MAIN_TAB_IDS = ['requisitions'] as const

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

/** Per-project line items when a contract row is expanded (grid columns mirror the parent row). */
type ContractProjectLine = {
  id: string
  name: string
  nextImportantDate: string
  startDate: string
  endDate: string
  contractValue: string
  fundedValue: string
  itdRevenue: string
  itdCost: string
  fundingPercent: number
}

type RequisitionRow = {
  id: string
  /** Contract reference in Contract Info column (e.g. CTR-2025-002). */
  contractNumber: string
  /** Contract Details summary — mirrors Command Center contract metadata. */
  contractType: string
  taskOrderNo: string
  projectType: string
  contractVehicle: string
  primeContractNo: string
  managerName: string
  /** Display string for Contract End (e.g. Jan 15, 2027). */
  contractEnd: string
  vendorId: string
  vendor: string
  amount: string
  /** Next milestone / review date (Command Center grid). */
  nextImportantDate: string
  /** Contract effective start. */
  startDate: string
  /** Funded (commitment) value. */
  fundedValue: string
  /** Incurred to date revenue. */
  itdRevenue: string
  /** Incurred to date cost. */
  itdCost: string
  /** Funding used — ITD as % of funded (0–100+). */
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
  /** Project lines shown when the contract row is expanded. */
  projects: readonly ContractProjectLine[]
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

/** Demo “today”: May 6, 2026 — aligns contract ends and expiry KPIs with `daysUntilContractExpiry`. (`Date` month is 0-based; `4` = May.) */
const COMMAND_CENTER_AS_OF = new Date(2026, 4, 6)

function formatContractEndFromDays(daysFromAsOf: number): string {
  const d = new Date(COMMAND_CENTER_AS_OF)
  d.setDate(d.getDate() + daysFromAsOf)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function makeDemoRow(spec: {
  id: string
  contractNumber: string
  vendor: string
  vendorId: string
  daysUntil: number
  fundingPercent: number
  statusLabel: string
  managerName: string
  amount?: string
}): RequisitionRow {
  const contractEnd = formatContractEndFromDays(spec.daysUntil)
  const amount = spec.amount ?? '$12,000.00'
  return {
    id: spec.id,
    contractNumber: spec.contractNumber,
    contractType: 'Firm Fixed Price',
    taskOrderNo: `TO-${spec.id.slice(-3)}`,
    projectType: 'Operations',
    contractVehicle: 'IDIQ',
    primeContractNo: 'PRIME-2024-0112',
    managerName: spec.managerName,
    contractEnd,
    vendorId: spec.vendorId,
    vendor: spec.vendor,
    amount,
    nextImportantDate: 'Apr 12, 2025',
    startDate: 'Apr 2, 2025',
    fundedValue: amount,
    itdRevenue: '$4,800.00',
    itdCost: '$3,900.00',
    fundingPercent: spec.fundingPercent,
    statusLabel: spec.statusLabel,
    stageIndices: [0, 2],
    overdue: '1/3',
    overdueUrgent: spec.fundingPercent >= 80,
    requestedBy: spec.managerName,
    organization: 'HQ — Procurement',
    createdDate: 'Apr 2, 2025',
    needBy: contractEnd,
    bannerMessage: '',
    buyerAssignedLineCount: 2,
    lateItemsStageCounts: [1, 0, 0, 0],
    requisitionerName: spec.managerName,
    requisitionerEmail: `${spec.managerName.toLowerCase().replace(/\s+/g, '.')}@contoso.com`,
    projects: [
      {
        id: `${spec.id}-P1`,
        name:
          spec.daysUntil % 2 === 0 ? 'HQ Facilities Refresh' : 'Field Services Expansion',
        nextImportantDate: 'Apr 12, 2025',
        startDate: 'Apr 2, 2025',
        endDate: contractEnd,
        contractValue: amount,
        fundedValue: amount,
        itdRevenue: '$4,800.00',
        itdCost: '$3,900.00',
        fundingPercent: spec.fundingPercent,
      },
    ],
    daysUntilContractExpiry: spec.daysUntil,
  }
}

/**
 * Demo roster sized for visualization options:
 * — 0–30 days: 6 (including 2 on May 9 / day 3, 3 on May 18 / day 12)
 * — 31–60 days: 4
 * — 61–90 days: 8
 */
const REQUISITION_ROWS: RequisitionRow[] = [
  // 0–30 days (6): May 9 ×2, May 18 ×3, plus May 14
  makeDemoRow({
    id: 'PR-2101',
    contractNumber: 'CTR-2026-101',
    vendor: 'Summit Field Services',
    vendorId: 'VND-901101',
    daysUntil: 3,
    fundingPercent: 71,
    statusLabel: 'Pending Approval',
    managerName: 'Alex Rivera',
    amount: '$8,200.00',
  }),
  makeDemoRow({
    id: 'PR-2102',
    contractNumber: 'CTR-2026-102',
    vendor: 'Harbor Labs West',
    vendorId: 'VND-901102',
    daysUntil: 3,
    fundingPercent: 55,
    statusLabel: 'Pending Approval',
    managerName: 'Jamie Chen',
    amount: '$11,400.00',
  }),
  makeDemoRow({
    id: 'PR-2047',
    contractNumber: 'CTR-2025-009',
    vendor: 'Armstrong Labs',
    vendorId: 'VND-900807',
    daysUntil: 8,
    fundingPercent: 92,
    statusLabel: 'Rejected',
    managerName: 'Sarah Johnson',
    amount: '$42,000.00',
  }),
  makeDemoRow({
    id: 'PR-2045',
    contractNumber: 'CTR-2025-003',
    vendor: 'Litware Medical Devices',
    vendorId: 'VND-900205',
    daysUntil: 12,
    fundingPercent: 64,
    statusLabel: 'Pending Approval',
    managerName: 'Sam Lee',
    amount: '$15,000.00',
  }),
  makeDemoRow({
    id: 'PR-2048',
    contractNumber: 'CTR-2025-005',
    vendor: 'Wide World Importers',
    vendorId: 'VND-900448',
    daysUntil: 12,
    fundingPercent: 82,
    statusLabel: 'Pending PO Creation',
    managerName: 'Priya Nair',
    amount: '$58,000.00',
  }),
  makeDemoRow({
    id: 'PR-2103',
    contractNumber: 'CTR-2026-103',
    vendor: 'Cascade Components',
    vendorId: 'VND-901103',
    daysUntil: 12,
    fundingPercent: 48,
    statusLabel: 'Pending Submittal',
    managerName: 'Morgan Chen',
    amount: '$9,750.00',
  }),

  // 31–60 days (4)
  makeDemoRow({
    id: 'PR-2201',
    contractNumber: 'CTR-2026-201',
    vendor: 'Beacon Industrial',
    vendorId: 'VND-902201',
    daysUntil: 35,
    fundingPercent: 66,
    statusLabel: 'Pending Approval',
    managerName: 'Taylor Kim',
    amount: '$14,200.00',
  }),
  makeDemoRow({
    id: 'PR-2202',
    contractNumber: 'CTR-2026-202',
    vendor: 'Riverbank Supply Co.',
    vendorId: 'VND-902202',
    daysUntil: 42,
    fundingPercent: 39,
    statusLabel: 'Pending Submittal',
    managerName: 'Casey Brooks',
    amount: '$7,800.00',
  }),
  makeDemoRow({
    id: 'PR-2041',
    contractNumber: 'CTR-2025-002',
    vendor: 'Acme Office Supplies',
    vendorId: 'VND-900101',
    daysUntil: 48,
    fundingPercent: 38,
    statusLabel: 'Pending Approval',
    managerName: 'Alex Rivera',
    amount: '$6,500.00',
  }),
  makeDemoRow({
    id: 'PR-2203',
    contractNumber: 'CTR-2026-203',
    vendor: 'Pinecrest Logistics',
    vendorId: 'VND-902203',
    daysUntil: 55,
    fundingPercent: 74,
    statusLabel: 'Pending PO Creation',
    managerName: 'Jordan Smith',
    amount: '$21,000.00',
  }),

  // 61–90 days (8)
  makeDemoRow({
    id: 'PR-2301',
    contractNumber: 'CTR-2026-301',
    vendor: 'Northshore MRO',
    vendorId: 'VND-903301',
    daysUntil: 62,
    fundingPercent: 52,
    statusLabel: 'Pending Approval',
    managerName: 'Riley Ortiz',
    amount: '$5,900.00',
  }),
  makeDemoRow({
    id: 'PR-2043',
    contractNumber: 'CTR-2025-006',
    vendor: 'Contoso Training Group',
    vendorId: 'VND-900503',
    daysUntil: 68,
    fundingPercent: 45,
    statusLabel: 'Pending Submittal',
    managerName: 'Morgan Chen',
    amount: '$10,500.00',
  }),
  makeDemoRow({
    id: 'PR-2042',
    contractNumber: 'CTR-2025-004',
    vendor: 'Northwind Logistics LLC',
    vendorId: 'VND-900302',
    daysUntil: 72,
    fundingPercent: 88,
    statusLabel: 'Pending PO Creation',
    managerName: 'Jordan Smith',
    amount: '$32,000.00',
  }),
  makeDemoRow({
    id: 'PR-2046',
    contractNumber: 'CTR-2025-007',
    vendor: 'Adventure Works IT',
    vendorId: 'VND-900606',
    daysUntil: 75,
    fundingPercent: 28,
    statusLabel: 'Pending Submittal',
    managerName: 'Casey Brooks',
    amount: '$4,500.00',
  }),
  makeDemoRow({
    id: 'PR-2302',
    contractNumber: 'CTR-2026-302',
    vendor: 'Blue Ridge Fabrication',
    vendorId: 'VND-903302',
    daysUntil: 78,
    fundingPercent: 61,
    statusLabel: 'Pending Approval',
    managerName: 'Sam Lee',
    amount: '$18,600.00',
  }),
  makeDemoRow({
    id: 'PR-2303',
    contractNumber: 'CTR-2026-303',
    vendor: 'Elm Street Electrical',
    vendorId: 'VND-903303',
    daysUntil: 82,
    fundingPercent: 69,
    statusLabel: 'Pending PO Creation',
    managerName: 'Priya Nair',
    amount: '$13,250.00',
  }),
  makeDemoRow({
    id: 'PR-2044',
    contractNumber: 'CTR-2025-008',
    vendor: 'Fabrikam Facilities Inc.',
    vendorId: 'VND-900704',
    daysUntil: 85,
    fundingPercent: 62,
    statusLabel: 'Rejected',
    managerName: 'Riley Ortiz',
    amount: '$5,500.00',
  }),
  makeDemoRow({
    id: 'PR-2304',
    contractNumber: 'CTR-2026-304',
    vendor: 'Oakline Security',
    vendorId: 'VND-903304',
    daysUntil: 88,
    fundingPercent: 33,
    statusLabel: 'Pending Submittal',
    managerName: 'Taylor Kim',
    amount: '$16,800.00',
  }),
]

const DEFAULT_EXPIRY_MAX_DAYS = 90

type ExpiryTierKey = 'critical' | 'warning' | 'upcoming'

function matchesExpiryTier(row: RequisitionRow, tier: ExpiryTierKey): boolean {
  const d = row.daysUntilContractExpiry
  if (tier === 'critical') return d <= 30
  if (tier === 'warning') return d >= 31 && d <= 60
  return d >= 61 && d <= 90
}

function matchesHighFunding(row: RequisitionRow): boolean {
  return row.fundingPercent >= 65
}

type FundingBucketKey = 'fundLow' | 'fundMid' | 'fundHigh'

function matchesFundingBucket(row: RequisitionRow, bucket: FundingBucketKey): boolean {
  const p = row.fundingPercent
  if (bucket === 'fundLow') return p <= 59
  if (bucket === 'fundMid') return p >= 60 && p <= 75
  return p >= 76
}

function parseDisplayDate(value: string): number {
  const t = Date.parse(value)
  return Number.isFinite(t) ? t : 0
}

function filterRowsByKpiSelection(
  rows: RequisitionRow[],
  selectedTier: ExpirationTierKey | null,
): RequisitionRow[] {
  const withinDefault = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  if (selectedTier == null) return withinDefault
  if (selectedTier === 'highFunding') return withinDefault.filter((r) => matchesHighFunding(r))
  if (selectedTier === 'fundLow' || selectedTier === 'fundMid' || selectedTier === 'fundHigh') {
    return withinDefault.filter((r) => matchesFundingBucket(r, selectedTier))
  }
  // Expiry tiers include every contract in the window, regardless of funding used.
  return withinDefault.filter((r) => matchesExpiryTier(r, selectedTier))
}

function summarizeFundingUtilization(rows: RequisitionRow[]): FundingUtilizationSummary {
  const base = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  const above = base.filter((r) => r.fundingPercent >= 65)
  return {
    aboveThresholdCount: above.length,
    totalInWindow: base.length,
    tiers: {
      critical: above.filter((r) => r.fundingPercent >= 90).length,
      elevated: above.filter((r) => r.fundingPercent >= 80 && r.fundingPercent < 90).length,
      normal: above.filter((r) => r.fundingPercent >= 65 && r.fundingPercent < 80).length,
    },
    belowThresholdCount: base.filter((r) => r.fundingPercent < 65).length,
    buckets: {
      low: base.filter((r) => r.fundingPercent <= 59).length,
      mid: base.filter((r) => r.fundingPercent >= 60 && r.fundingPercent <= 75).length,
      high: base.filter((r) => r.fundingPercent >= 76).length,
    },
  }
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

function summarizeExpirationTierContracts(rows: RequisitionRow[]): {
  critical: ExpiryTierContract[]
  warning: ExpiryTierContract[]
  upcoming: ExpiryTierContract[]
} {
  const base = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  const toContract = (row: RequisitionRow): ExpiryTierContract => ({
    name: row.vendor,
    expirationDate: row.contractEnd,
    daysRemaining: row.daysUntilContractExpiry,
  })
  const sortByExpiry = (tierRows: RequisitionRow[]) =>
    [...tierRows].sort((a, b) => a.daysUntilContractExpiry - b.daysUntilContractExpiry).map(toContract)

  return {
    critical: sortByExpiry(base.filter((r) => matchesExpiryTier(r, 'critical'))),
    warning: sortByExpiry(base.filter((r) => matchesExpiryTier(r, 'warning'))),
    upcoming: sortByExpiry(base.filter((r) => matchesExpiryTier(r, 'upcoming'))),
  }
}

function summarizeExpirationTierFirstExpiry(rows: RequisitionRow[]): {
  critical: TierExpiryLine
  warning: TierExpiryLine
  upcoming: TierExpiryLine
} {
  const tiers = ['critical', 'warning', 'upcoming'] as const satisfies readonly ExpiryTierKey[]
  const base = rows.filter((r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS)
  const result: {
    critical: TierExpiryLine
    warning: TierExpiryLine
    upcoming: TierExpiryLine
  } = {
    critical: null,
    warning: null,
    upcoming: null,
  }
  for (const tier of tiers) {
    const inTier = base.filter((r) => matchesExpiryTier(r, tier))
    if (inTier.length === 0) continue
    const row = inTier.reduce((a, b) =>
      a.daysUntilContractExpiry <= b.daysUntilContractExpiry ? a : b,
    )
    const d = row.daysUntilContractExpiry
    result[tier] = {
      firstExpiresDate: formatContractEndFromDays(d),
      daysUntilShort: `${d}d`,
    }
  }
  return result
}

function summarizeHighFunding(rows: RequisitionRow[]): {
  count: number
  line: HighFundingLine
} {
  const base = rows.filter(
    (r) => r.daysUntilContractExpiry <= DEFAULT_EXPIRY_MAX_DAYS && matchesHighFunding(r),
  )
  if (base.length === 0) return { count: 0, line: null }
  const highestRow = base.reduce((a, b) => (a.fundingPercent >= b.fundingPercent ? a : b))
  return {
    count: base.length,
    line: { highestPct: highestRow.fundingPercent, vendorName: highestRow.vendor },
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

function vendorEmailForRow(row: RequisitionRow): string {
  const slug = row.vendor
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
  return `contact@${slug || 'vendor'}.com`
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

function contractInfoCell(
  row: RequisitionRow,
  opts: {
    expanded: boolean
    onToggleExpand: (e: MouseEvent<HTMLButtonElement>) => void
    onSelectContract: (e: MouseEvent<HTMLButtonElement>) => void
  },
) {
  const hasProjects = row.projects.length > 0
  return (
    <td className="command-center-contract-info">
      <div className="command-center-contract-info__layout">
        {hasProjects ? (
          <button
            type="button"
            className="command-center-contract-info__expand"
            aria-expanded={opts.expanded}
            aria-controls={`contract-projects-${row.id}`}
            aria-label={
              opts.expanded ? `Collapse projects for ${row.contractNumber}` : `Expand projects for ${row.contractNumber}`
            }
            onClick={(e) => opts.onToggleExpand(e)}
          >
            <Icon name={opts.expanded ? 'chevron-down' : 'chevron-right'} size="sm" aria-hidden />
          </button>
        ) : (
          <span className="command-center-contract-info__expand-spacer" aria-hidden />
        )}
        <div className="command-center-contract-info__stack">
          <button
            type="button"
            className="command-center-contract-info__id"
            aria-label={`Open contract ${row.contractNumber}`}
            onClick={opts.onSelectContract}
          >
            {row.contractNumber}
          </button>
          <span className="command-center-contract-info__vendor">{row.vendor}</span>
        </div>
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
      {commandCenterHeaderTh('ITD Revenue', 'right')}
      {commandCenterHeaderTh('ITD Cost', 'right')}
      {commandCenterHeaderTh('Funding Used', 'right')}
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
  expandedContractIds,
  onToggleContractExpanded,
}: {
  rows: RequisitionRow[]
  selectedId: string | null
  onSelectRow: (id: string) => void
  expandedContractIds: readonly string[]
  onToggleContractExpanded: (rowId: string) => void
}) {
  return (
    <tbody>
      {rows.map((row) => {
        const expanded = expandedContractIds.includes(row.id)
        return (
          <Fragment key={row.id}>
            <tr
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
              {contractInfoCell(row, {
                expanded,
                onToggleExpand: (e) => {
                  e.stopPropagation()
                  onToggleContractExpanded(row.id)
                },
                onSelectContract: (e) => {
                  e.stopPropagation()
                  onSelectRow(row.id)
                },
              })}
              <td>{row.nextImportantDate}</td>
              <td>{row.startDate}</td>
              <td>{row.needBy}</td>
              <td className="text-right">{row.amount}</td>
              <td className="text-right">{row.fundedValue}</td>
              <td className="text-right">{row.itdRevenue}</td>
              <td className="text-right">{row.itdCost}</td>
              <td
                className={clsx(
                  'text-right',
                  row.fundingPercent >= 65 && 'command-center-funding-used--high',
                )}
              >
                {row.fundingPercent}%
              </td>
            </tr>
            {expanded &&
              row.projects.map((proj, projIdx) => (
                <tr
                  key={`${row.id}-proj-${proj.id}`}
                  className="command-center-contract-project-row command-center-table-row--project"
                  tabIndex={0}
                  onClick={() => onSelectRow(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectRow(row.id)
                    }
                  }}
                >
                  <td
                    className="command-center-contract-project-row__first"
                    id={projIdx === 0 ? `contract-projects-${row.id}` : undefined}
                  >
                    <div className="command-center-contract-project-row__indent">
                      <div className="command-center-contract-project-row__stack">
                        <button
                          type="button"
                          className="command-center-contract-project-row__id"
                          aria-label={`Open project ${proj.id}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectRow(row.id)
                          }}
                        >
                          {proj.id}
                        </button>
                        <span className="command-center-contract-project-row__name">{proj.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{proj.nextImportantDate}</td>
                  <td>{proj.startDate}</td>
                  <td>{proj.endDate}</td>
                  <td className="text-right">{proj.contractValue}</td>
                  <td className="text-right">{proj.fundedValue}</td>
                  <td className="text-right">{proj.itdRevenue}</td>
                  <td className="text-right">{proj.itdCost}</td>
                  <td
                    className={clsx(
                      'text-right',
                      proj.fundingPercent >= 65 && 'command-center-funding-used--high',
                    )}
                  >
                    {proj.fundingPercent}%
                  </td>
                </tr>
              ))}
          </Fragment>
        )
      })}
    </tbody>
  )
}

function RequisitionSidePanel({
  row,
  onClose,
  onOpenRequisitionReportTab,
  summaryAccordionOpen,
  onSummaryAccordionOpenChange,
}: {
  row: RequisitionRow
  onClose: () => void
  onOpenRequisitionReportTab: (prId: string) => void
  summaryAccordionOpen: boolean
  onSummaryAccordionOpenChange: (open: boolean) => void
}) {
  const reportHref = requisitionReportHref(row.id)
  const fundingUsedHigh = row.fundingPercent > 65
  const [vendorEmailOpen, setVendorEmailOpen] = useState(false)

  return (
    <>
    <aside
      className="command-center-requisition-panel"
      aria-label={`Contract details for ${row.contractNumber}`}
      aria-labelledby="cc-req-panel-title"
    >
      <header className="command-center-requisition-panel__header">
        <h2 className="command-center-requisition-panel__title" id="cc-req-panel-title">
          Contract Details
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
          <span className="command-center-requisition-panel__pr-id">{row.contractNumber}</span>
          <div className="command-center-requisition-panel__report-links">
            <Link
              href={reportHref}
              size="small"
              title="Open Contract Details Report in a Command Center tab"
              onClick={(e) => {
                e.preventDefault()
                onOpenRequisitionReportTab(row.id)
              }}
            >
              Contract Details Report
            </Link>
            <Link
              href="#"
              size="small"
              title="Open Smart Summaries"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
              }}
            >
              Smart Summaries
            </Link>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'command-center-requisition-panel__funding-strip',
          fundingUsedHigh
            ? 'command-center-requisition-panel__funding-strip--warn'
            : 'command-center-requisition-panel__funding-strip--neutral',
        )}
      >
        <div
          className="command-center-requisition-panel__stat-callout"
          aria-label={`Funding used ${row.fundingPercent} percent`}
        >
          <p className="command-center-requisition-panel__stat-callout-pct">{row.fundingPercent}%</p>
          <p className="command-center-requisition-panel__stat-callout-label">Funding used</p>
        </div>
      </div>
      <div className="command-center-requisition-panel__body">
        <RequisitionDetailSummary
          row={row}
          open={summaryAccordionOpen}
          onOpenChange={onSummaryAccordionOpenChange}
          onVendorClick={() => setVendorEmailOpen(true)}
        />
        <RequisitionRiskStatusSection row={row} />
      </div>
    </aside>
    <VendorEmailDialog
      row={row}
      open={vendorEmailOpen}
      onClose={() => setVendorEmailOpen(false)}
    />
    </>
  )
}

function VendorEmailDialog({
  row,
  open,
  onClose,
}: {
  row: RequisitionRow
  open: boolean
  onClose: () => void
}) {
  const to = vendorEmailForRow(row)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (!open) return
    setSubject('')
    setBody('')
  }, [open, row.id])

  return (
    <Dialog
      id={`vendor-email-${row.id}`}
      title={`Email ${row.vendor}`}
      open={open}
      onClose={onClose}
      resizable={false}
      footer={
        <div className="dialog__footer-actions">
          <Button buttonType="theme" variant="primary" onClick={onClose}>
            Send
          </Button>
          <Button buttonType="theme" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <div className="command-center-vendor-email">
        <Input label="To" labelVariant="stacked" type="email" value={to} readOnly />
        <Input
          label="Subject"
          labelVariant="stacked"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          label="Message"
          labelVariant="stacked"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
    </Dialog>
  )
}

function ContractSummaryField({
  label,
  value,
  onValueClick,
  emailLink = false,
}: {
  label: string
  value: string
  onValueClick?: () => void
  emailLink?: boolean
}) {
  return (
    <div className="command-center-requisition-summary__field">
      <div className="command-center-requisition-summary__label">{label}</div>
      <div className="command-center-requisition-summary__value">
        {onValueClick != null ? (
          <Link
            href="#"
            size="small"
            title={emailLink ? `Compose email to ${value}` : `Email ${value}`}
            className={emailLink ? 'command-center-summary-email-link' : undefined}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              onValueClick()
            }}
          >
            {emailLink && <Icon name="envelope" size="xs" aria-hidden />}
            {value}
          </Link>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

function RequisitionDetailSummary({
  row,
  open,
  onOpenChange,
  onVendorClick,
}: {
  row: RequisitionRow
  open: boolean
  onOpenChange: (next: boolean) => void
  onVendorClick: () => void
}) {
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
          <ContractSummaryField label="Contract ID" value={row.contractNumber} />
          <ContractSummaryField
            label="Customer"
            value={row.vendor}
            onValueClick={onVendorClick}
            emailLink
          />
          <ContractSummaryField label="Manager" value={row.managerName} />
          <ContractSummaryField label="Contract Type" value={row.contractType} />
          <ContractSummaryField label="Project Type" value={row.projectType} />
          <ContractSummaryField label="Prime Contract No." value={row.primeContractNo} />
          <ContractSummaryField label="Task Order No." value={row.taskOrderNo} />
          <ContractSummaryField label="Contract Vehicle" value={row.contractVehicle} />
          <ContractSummaryField label="Contract End" value={row.contractEnd} />
          <ContractSummaryField label="Contract Value" value={row.amount} />
          <ContractSummaryField label="Funded Value" value={row.fundedValue} />
          <ContractSummaryField label="ITD Revenue" value={row.itdRevenue} />
          <ContractSummaryField label="ITD Cost" value={row.itdCost} />
        </div>
      </div>
    </details>
  )
}

function RequisitionRiskStatusSection({ row }: { row: RequisitionRow }) {
  const frac = parseOverdueFraction(row.overdue)
  const lateStatusEntries = row.lateItemsStageCounts
    .map((count, stageIndex) => ({ count, stageIndex }))
    .filter(({ count }) => count > 0)

  return (
    <section
      className="command-center-requisition-accordion command-center-requisition-accordion--risk-collapsed"
      aria-label="Risk Status"
    >
      <div
        className="command-center-requisition-accordion__summary command-center-requisition-accordion__summary--noninteractive"
        aria-expanded="false"
      >
        <span className="command-center-requisition-accordion__summary-main">
          <Icon
            name="chevron-right"
            size="sm"
            className="command-center-requisition-accordion__expand-icon"
            aria-hidden
          />
          <span className="command-center-requisition-accordion__summary-text">Risk Status</span>
        </span>
      </div>
      <div className="command-center-requisition-accordion__content" hidden>
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
    </section>
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
  const [expirationTierFilter, setExpirationTierFilter] = useState<ExpirationTierKey | null>(null)
  const [vizDesignOption, setVizDesignOption] = useState<VizDesignOption>('option7')
  const [dailyChartIteration, setDailyChartIteration] = useState<DailyChartIteration>('iteration1')
  const [expandedContractIds, setExpandedContractIds] = useState<string[]>([])
  const [interactionRulesOpen, setInteractionRulesOpen] = useState(false)
  const kpiFilterZoneRef = useRef<HTMLDivElement>(null)
  const themeProps = THEME_SHELL_PROPS[DEFAULT_THEME] ?? THEME_SHELL_PROPS['theme-cp']

  const handleSelectKpiTier = useCallback((tier: ExpirationTierKey) => {
    setExpirationTierFilter((prev) => (prev === tier ? null : tier))
  }, [])

  const toggleContractExpanded = useCallback((rowId: string) => {
    setExpandedContractIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
    )
  }, [])

  const expirationTierCounts = useMemo(() => summarizeExpirationTierCounts(REQUISITION_ROWS), [])

  const expirationTierContracts = useMemo(
    () => summarizeExpirationTierContracts(REQUISITION_ROWS),
    [],
  )

  const expirationTierExpiryLines = useMemo(
    () => summarizeExpirationTierFirstExpiry(REQUISITION_ROWS),
    [],
  )

  const highFundingSummary = useMemo(() => summarizeHighFunding(REQUISITION_ROWS), [])

  const fundingUtilization = useMemo(
    () => summarizeFundingUtilization(REQUISITION_ROWS),
    [],
  )

  const filteredRequisitionRows = useMemo(
    () => filterRowsByKpiSelection(REQUISITION_ROWS, expirationTierFilter),
    [expirationTierFilter],
  )

  const sortedFilteredRequisitionRows = useMemo(
    () =>
      [...filteredRequisitionRows].sort(
        (a, b) => parseDisplayDate(a.nextImportantDate) - parseDisplayDate(b.nextImportantDate),
      ),
    [filteredRequisitionRows],
  )

  const selectedRequisition = useMemo(
    () => sortedFilteredRequisitionRows.find((r) => r.id === selectedRequisitionId) ?? null,
    [sortedFilteredRequisitionRows, selectedRequisitionId],
  )

  useEffect(() => {
    setReqPanelSummaryOpen(true)
  }, [selectedRequisitionId])

  useEffect(() => {
    if (selectedRequisitionId == null) return
    if (!filteredRequisitionRows.some((r) => r.id === selectedRequisitionId)) {
      setSelectedRequisitionId(null)
    }
  }, [filteredRequisitionRows, selectedRequisitionId])

  useEffect(() => {
    if (expirationTierFilter === null) return
    const onDocPointerDown = (e: PointerEvent) => {
      const el = kpiFilterZoneRef.current
      if (el != null && !el.contains(e.target as Node)) {
        setExpirationTierFilter(null)
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [expirationTierFilter])

  useEffect(() => {
    const logoLink = document.querySelector<HTMLAnchorElement>(
      '.shell-layout__header .header__brand-link',
    )
    if (logoLink == null) return

    const onLogoClick = (e: globalThis.MouseEvent) => {
      e.preventDefault()
      setInteractionRulesOpen(true)
    }

    logoLink.addEventListener('click', onLogoClick)
    return () => logoLink.removeEventListener('click', onLogoClick)
  }, [])

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
    if (activeTabId !== 'requisitions') {
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
      label: 'Contracts Expiration Timeline',
      active: activeTabId === id,
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
    <>
      <ShellLayout
        {...themeProps}
        pageHeaderTitle="Command Center"
        pageHeaderShowDefaultButtons={false}
        pageHeaderActions={
          activeTabId === 'requisitions' ? (
            <div className="command-center-header-pickers">
              <VizDesignOptionPicker
                variant="header"
                value={vizDesignOption}
                onChange={setVizDesignOption}
              />
              {vizDesignOption === 'option7' ? (
                <DailyChartIterationPicker
                  variant="header"
                  value={dailyChartIteration}
                  onChange={setDailyChartIteration}
                />
              ) : null}
            </div>
          ) : null
        }
      >
      <Card primary elevated className="command-center-home">
        <div className="card__body">
          <div className="command-center-tab-row">
            <TabStrip
              tabs={commandCenterTabs}
              onTabSelected={(id: string) => {
                if (
                  id === 'requisitions' ||
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

          {activeTabId === 'requisitions' && (
            <div className="command-center-requisitions-workspace">
              <div ref={kpiFilterZoneRef} className="command-center-kpi-filter-zone">
                <ContractsExpirationDashboard
                  key={refreshTick}
                  designOption={vizDesignOption}
                  chartIteration={dailyChartIteration}
                  tierCounts={expirationTierCounts}
                  tierContracts={expirationTierContracts}
                  tierExpiryLines={expirationTierExpiryLines}
                  highFundingCount={highFundingSummary.count}
                  highFundingLine={highFundingSummary.line}
                  fundingUtilization={fundingUtilization}
                  selectedTier={expirationTierFilter}
                  onSelectTier={handleSelectKpiTier}
                  onClearTier={() => setExpirationTierFilter(null)}
                  asOfDate={COMMAND_CENTER_AS_OF}
                />
              </div>
              <div className="lifecycle-bar-chart__table command-center-table-detail-anchor">
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
                    }}
                  >
                    Expand All
                  </Button>
                </div>
                <div className="command-center-table-split">
                  <div className="command-center-table-detail-stack">
                    <div className="command-center-contracts-table-wrap">
                      <Table
                        headerVariant="white"
                        striped
                        className="command-center-data-table"
                        header={REQUISITION_TABLE_HEADER}
                        body={
                          <RequisitionTableBody
                            rows={sortedFilteredRequisitionRows}
                            selectedId={selectedRequisitionId}
                            onSelectRow={setSelectedRequisitionId}
                            expandedContractIds={expandedContractIds}
                            onToggleContractExpanded={toggleContractExpanded}
                          />
                        }
                      />
                    </div>
                  </div>
                  {selectedRequisition != null && (
                    <RequisitionSidePanel
                      row={selectedRequisition}
                      onClose={() => setSelectedRequisitionId(null)}
                      onOpenRequisitionReportTab={openPrRequisitionDetailTab}
                      summaryAccordionOpen={reqPanelSummaryOpen}
                      onSummaryAccordionOpenChange={setReqPanelSummaryOpen}
                    />
                  )}
                </div>
              </div>
            </div>
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
      <Dialog
        id="command-center-interaction-rules"
        title="Interaction rules"
        open={interactionRulesOpen}
        onClose={() => setInteractionRulesOpen(false)}
        resizable={false}
        footer={
          <div className="dialog__footer-actions">
            <Button
              buttonType="theme"
              variant="primary"
              onClick={() => setInteractionRulesOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <InteractionRulesPanel />
      </Dialog>
    </>
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
