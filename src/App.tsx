import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ShellLayout } from './components/harmony/ShellLayout'
import type { ShellLayoutProps } from './components/harmony/ShellLayout'
import { Card } from './components/harmony/Card'
import { TabStrip } from './components/harmony/TabStrip'
import { Table } from './components/harmony/Table'
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

const HOME_MAIN_TABS = [
  { id: 'requisitions', label: 'Requisitions', active: true },
  { id: 'purchase-orders', label: 'Purchase Orders' },
]

const HOME_TABLE_HEADER = (
  <thead>
    <tr>
      <th className="text-left" scope="col">
        Requisition ID
      </th>
      <th className="text-left" scope="col">
        Description
      </th>
      <th className="text-left" scope="col">
        Status
      </th>
      <th className="text-right" scope="col">
        Amount
      </th>
    </tr>
  </thead>
)

const HOME_TABLE_BODY = (
  <tbody>
    <tr>
      <td>REQ-1001</td>
      <td>Office supplies</td>
      <td>Pending approval</td>
      <td className="text-right">$1,250.00</td>
    </tr>
    <tr>
      <td>REQ-1002</td>
      <td>IT hardware refresh</td>
      <td>Approved</td>
      <td className="text-right">$8,420.50</td>
    </tr>
    <tr>
      <td>REQ-1003</td>
      <td>Training services</td>
      <td>Draft</td>
      <td className="text-right">$2,100.00</td>
    </tr>
  </tbody>
)

function HomeShell() {
  const themeProps = THEME_SHELL_PROPS[DEFAULT_THEME] ?? THEME_SHELL_PROPS['theme-cp']
  return (
    <ShellLayout {...themeProps} pageHeaderTitle="">
      <Card primary elevated>
        <div className="card__body">
          <TabStrip
            tabs={HOME_MAIN_TABS}
            overflowMode="none"
            className="mb-4"
          />
          <div style={{ overflowX: 'auto' }}>
            <Table
              headerVariant="gray"
              header={HOME_TABLE_HEADER}
              body={HOME_TABLE_BODY}
            />
          </div>
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
