import { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ShellLayout } from './components/harmony/ShellLayout'
import type { ShellLayoutProps } from './components/harmony/ShellLayout'
import { Card } from './components/harmony/Card'
import { TabStrip } from './components/harmony/TabStrip'
import { Table } from './components/harmony/Table'
import { LifecycleBarChart } from './components/harmony/LifecycleBarChart'
import type { LifecycleBarChartBar } from './components/harmony/LifecycleBarChart'
import { Link } from './components/harmony/Link'
import { ComponentGalleryPage } from './pages/ComponentGalleryPage'
import { ComponentDemoPage } from './pages/ComponentDemoPage'

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
type HomeMainTabId = (typeof REQ_MAIN_TAB_IDS)[number]

/** Bar colors aligned with PO Command Center reference; requisitions use the first four tones. */
const REQ_LIFECYCLE_COLORS = {
  pendingSubmittal: '#f97316',
  rejected: '#dc2626',
  pendingApproval: '#ec4899',
  pendingPoCreation: '#1d4ed8',
} as const

const REQUISITION_CHART_BARS: LifecycleBarChartBar[] = [
  {
    id: 'pending-submittal',
    label: 'Pending Submittal',
    value: 100,
    color: REQ_LIFECYCLE_COLORS.pendingSubmittal,
    description:
      'PR has been assigned to the Buyer and in Pending status',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    value: 20,
    color: REQ_LIFECYCLE_COLORS.rejected,
    description: 'PR has been assigned to the Buyer and in Rejected status',
  },
  {
    id: 'pending-approval',
    label: 'Pending Approval',
    value: 45,
    color: REQ_LIFECYCLE_COLORS.pendingApproval,
    description:
      'PR has been assigned to the Buyer and In-Approval',
  },
  {
    id: 'pending-po-creation',
    label: 'Pending PO Creation',
    value: 60,
    color: REQ_LIFECYCLE_COLORS.pendingPoCreation,
    description:
      'PR has been assigned to the Buyer and Approved',
  },
]

const PO_CHART_BARS: LifecycleBarChartBar[] = [
  { id: 'po-pending-approval', label: 'Pending Approval', value: 168, color: '#f97316' },
  { id: 'po-pending-receipt', label: 'Pending Receipt', value: 166, color: '#dc2626' },
  { id: 'po-pending-inspection', label: 'Pending Inspection', value: 40, color: '#ec4899' },
  { id: 'po-awaiting-inv', label: 'Awaiting Invoice', value: 29, color: '#1d4ed8' },
  { id: 'po-pending-inv-approval', label: 'Pending Inv Approval', value: 54, color: '#38bdf8' },
  { id: 'po-awaiting-payment', label: 'Awaiting Payment', value: 39, color: '#9ca3af' },
]

/** Dot order matches the requisition lifecycle bar chart (left → right). */
const REQ_STATUS_DOT_COLORS = [
  REQ_LIFECYCLE_COLORS.pendingSubmittal,
  REQ_LIFECYCLE_COLORS.rejected,
  REQ_LIFECYCLE_COLORS.pendingApproval,
  REQ_LIFECYCLE_COLORS.pendingPoCreation,
] as const

function statusCell(label: string, color: string) {
  return (
    <td>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        {label}
      </span>
    </td>
  )
}

/**
 * Status column: lifecycle dots only (Command Center reference — small solid
 * stage markers, no visible label). Screen readers get the status via sr-only.
 */
function reqStatusTrailCell(statusLabel: string, filledDotIndices: readonly number[]) {
  const filled = new Set(filledDotIndices)
  return (
    <td>
      <span
        role="img"
        aria-label={`PR status: ${statusLabel}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '6px',
        }}
      >
        {REQ_STATUS_DOT_COLORS.map((color, i) => {
          const isActive = filled.has(i)
          return (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: color,
                opacity: isActive ? 1 : 0.2,
              }}
            />
          )
        })}
      </span>
    </td>
  )
}

function prIdCell(id: string) {
  return (
    <td>
      <Link
        href="#"
        size="small"
        title="Apply PO Info to Purchase Requisitions"
        aria-label={`${id}: Apply PO Info to Purchase Requisitions`}
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        {id}
      </Link>
    </td>
  )
}

const REQUISITION_TABLE_HEADER = (
  <thead>
    <tr>
      <th
        className="text-left"
        scope="col"
        title="PR ID — link to Apply PO Info to Purchase Requisitions"
      >
        PR ID
      </th>
      <th className="text-left" scope="col">
        Preferred Vendor Name
      </th>
      <th className="text-right" scope="col">
        Total Amount
      </th>
      <th className="text-left" scope="col">
        Status
      </th>
      <th className="text-right" scope="col">
        Overdue
      </th>
    </tr>
  </thead>
)

const REQUISITION_TABLE_BODY = (
  <tbody>
    <tr>
      {prIdCell('PR-2041')}
      <td>Acme Office Supplies</td>
      <td className="text-right">$1,250.00</td>
      {reqStatusTrailCell('Pending Approval', [0, 2])}
      <td className="text-right" style={{ color: '#dc2626' }}>
        2/5
      </td>
    </tr>
    <tr>
      {prIdCell('PR-2045')}
      <td>Litware Medical Devices</td>
      <td className="text-right">$3,890.25</td>
      {reqStatusTrailCell('Pending Approval', [0, 2])}
      <td className="text-right">0/6</td>
    </tr>
    <tr>
      {prIdCell('PR-2042')}
      <td>Northwind Logistics LLC</td>
      <td className="text-right">$8,420.50</td>
      {reqStatusTrailCell('Pending PO Creation', [0, 2, 3])}
      <td className="text-right">0/4</td>
    </tr>
    <tr>
      {prIdCell('PR-2048')}
      <td>Wide World Importers</td>
      <td className="text-right">$22,150.00</td>
      {reqStatusTrailCell('Pending PO Creation', [0, 2, 3])}
      <td className="text-right" style={{ color: '#dc2626' }}>
        4/9
      </td>
    </tr>
    <tr>
      {prIdCell('PR-2043')}
      <td>Contoso Training Group</td>
      <td className="text-right">$2,100.00</td>
      {reqStatusTrailCell('Pending Submittal', [0])}
      <td className="text-right" style={{ color: '#dc2626' }}>
        1/3
      </td>
    </tr>
    <tr>
      {prIdCell('PR-2046')}
      <td>Adventure Works IT</td>
      <td className="text-right">$475.90</td>
      {reqStatusTrailCell('Pending Submittal', [0])}
      <td className="text-right">0/2</td>
    </tr>
    <tr>
      {prIdCell('PR-2044')}
      <td>Fabrikam Facilities Inc.</td>
      <td className="text-right">$640.00</td>
      {reqStatusTrailCell('Rejected', [0, 1])}
      <td className="text-right">0/2</td>
    </tr>
    <tr>
      {prIdCell('PR-2047')}
      <td>Blue Yonder Analytics</td>
      <td className="text-right">$9,999.00</td>
      {reqStatusTrailCell('Rejected', [0, 2, 1])}
      <td className="text-right" style={{ color: '#dc2626' }}>
        3/3
      </td>
    </tr>
  </tbody>
)

const PO_TABLE_HEADER = (
  <thead>
    <tr>
      <th className="text-left" scope="col">
        PO ID
      </th>
      <th className="text-left" scope="col">
        Release
      </th>
      <th className="text-left" scope="col">
        Type
      </th>
      <th className="text-left" scope="col">
        Vendor Name
      </th>
      <th className="text-right" scope="col">
        Total Amt
      </th>
      <th className="text-left" scope="col">
        Status
      </th>
      <th className="text-right" scope="col">
        Overdue Lines
      </th>
    </tr>
  </thead>
)

const PO_TABLE_BODY = (
  <tbody>
    <tr>
      <td>
        <span className="text-link" style={{ color: 'var(--link-color, #2563eb)' }}>
          PO-1039
        </span>
      </td>
      <td>PO-1039</td>
      <td>Standard PO</td>
      <td>Acme Office Co.</td>
      <td className="text-right">$12,400.00</td>
      {statusCell('Pending Approval', '#f97316')}
      <td className="text-right" style={{ color: '#dc2626' }}>
        5/7
      </td>
    </tr>
    <tr>
      <td>
        <span className="text-link" style={{ color: 'var(--link-color, #2563eb)' }}>
          PO-1040
        </span>
      </td>
      <td>PO-1040</td>
      <td>Blanket PO</td>
      <td>Northwind Logistics</td>
      <td className="text-right">$3,210.50</td>
      {statusCell('Pending Receipt', '#dc2626')}
      <td className="text-right" style={{ color: '#dc2626' }}>
        2/4
      </td>
    </tr>
    <tr>
      <td>
        <span className="text-link" style={{ color: 'var(--link-color, #2563eb)' }}>
          PO-1041
        </span>
      </td>
      <td>PO-1041</td>
      <td>Sub Contract</td>
      <td>Contoso Services</td>
      <td className="text-right">$18,990.00</td>
      {statusCell('Awaiting Invoice', '#1d4ed8')}
      <td className="text-right">0/3</td>
    </tr>
  </tbody>
)

function HomeShell() {
  const [mainTab, setMainTab] = useState<HomeMainTabId>('requisitions')
  const themeProps = THEME_SHELL_PROPS[DEFAULT_THEME] ?? THEME_SHELL_PROPS['theme-cp']

  const mainTabs = useMemo(
    () =>
      REQ_MAIN_TAB_IDS.map((id) => ({
        id,
        label: id === 'requisitions' ? 'Requisitions' : 'Purchase Orders',
        active: id === mainTab,
      })),
    [mainTab],
  )

  return (
    <ShellLayout
      {...themeProps}
      pageHeaderTitle="Command Center"
      pageHeaderShowDefaultButtons={false}
    >
      <Card primary elevated className="command-center-home">
        <div className="card__body">
          <TabStrip
            tabs={mainTabs}
            activeTabId={mainTab}
            onTabChange={(id) => {
              if (id === 'requisitions' || id === 'purchase-orders') setMainTab(id)
            }}
            overflowMode="none"
            className="tabstrip--command-center-tabs mb-4"
          />

          {mainTab === 'requisitions' && (
            <LifecycleBarChart
              title="Requisition lifecycle"
              bars={REQUISITION_CHART_BARS}
              yAxisMax={120}
            >
              <Table
                headerVariant="gray"
                striped
                header={REQUISITION_TABLE_HEADER}
                body={REQUISITION_TABLE_BODY}
              />
            </LifecycleBarChart>
          )}

          {mainTab === 'purchase-orders' && (
            <LifecycleBarChart title="PO lifecycle" bars={PO_CHART_BARS} yAxisMax={200}>
              <Table
                headerVariant="gray"
                striped
                header={PO_TABLE_HEADER}
                body={PO_TABLE_BODY}
              />
            </LifecycleBarChart>
          )}
        </div>
      </Card>
    </ShellLayout>
  )
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
    <Routes>
      <Route path="/" element={<HomeShell />} />
      <Route path="/components" element={<ComponentGalleryPage />} />
      <Route path="/components/:componentName" element={<ComponentDemoPage />} />
    </Routes>
  )
}

export default App
