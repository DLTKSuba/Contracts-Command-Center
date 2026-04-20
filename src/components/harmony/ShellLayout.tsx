import clsx from 'clsx'
import { ShellHeader } from './ShellHeader'
import type { CompanyOption } from './ShellHeader'
import { ShellFooter } from './ShellFooter'
import { FloatingNav } from './FloatingNav'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { ShellPageHeader } from './ShellPageHeader'
import { Card } from './Card'
import type { ShellFooterTab } from './ShellFooter'
import type { ShellPageHeaderButtonConfig } from './ShellPageHeader'
import type { LeftSidebarSection, LeftSidebarVariant } from './LeftSidebar'
import type { RightSidebarSection, RightSidebarVariant } from './RightSidebar'
import type { FloatingNavPreset } from './FloatingNav'
import './ShellLayout.css'

function resolveFloatingNavPreset(
  explicit: FloatingNavPreset | undefined,
): FloatingNavPreset {
  if (explicit != null) return explicit
  return typeof window !== 'undefined' &&
    window.__COSTPOINT_COMMAND_CENTER_NAV__ === true
    ? 'command-center'
    : 'default'
}

export interface ShellLayoutProps {
  productName?: string
  logoSrc?: string
  companyName?: string
  showCompanyPicker?: boolean
  companyColor?: string
  /** Company options for the header picker; when not provided, ShellHeader uses its default list. */
  companies?: CompanyOption[]
  // CP-specific props
  showFloatingNav?: boolean
  floatingNavVariant?: 'full' | 'compact'
  /** When unset, uses `window.__COSTPOINT_COMMAND_CENTER_NAV__` from `index-cc.html`. */
  floatingNavPreset?: FloatingNavPreset
  showExecute?: boolean
  saveDisabled?: boolean
  leftSidebarVariant?: LeftSidebarVariant
  // Standard props
  tabs?: ShellFooterTab[]
  showMoreTabs?: boolean
  moreCount?: number
  overflowTabs?: ShellFooterTab[]
  showAddTab?: boolean
  footerVariant?: 'default' | 'compact'
  showFooter?: boolean
  showRightSidebar?: boolean
  pageHeaderTitle?: string
  pageHeaderSubtitle?: string
  pageHeaderPrimaryButton?: ShellPageHeaderButtonConfig
  pageHeaderOutlineButton1?: ShellPageHeaderButtonConfig
  pageHeaderOutlineButton2?: ShellPageHeaderButtonConfig
  pageHeaderOutlineButton3?: ShellPageHeaderButtonConfig
  /** When false, hides default Primary / Secondary buttons when no custom header buttons are set. */
  pageHeaderShowDefaultButtons?: boolean
  pageHeaderActions?: React.ReactNode
  leftSidebarSections?: LeftSidebarSection[]
  rightSidebarSections?: RightSidebarSection[]
  rightSidebarVariant?: RightSidebarVariant
  className?: string
  children?: React.ReactNode
}

const DEFAULT_TABS: ShellFooterTab[] = [
  { id: 'tab-1', label: 'Home', active: true },
  { id: 'tab-2', label: 'Projects', icon: 'building-office' },
  { id: 'tab-3', label: 'Reports', icon: 'Report' },
]

export function ShellLayout({
  productName,
  logoSrc,
  companyName,
  showCompanyPicker = true,
  companyColor,
  companies,
  showFloatingNav,
  floatingNavVariant,
  floatingNavPreset,
  showExecute,
  saveDisabled,
  leftSidebarVariant,
  tabs = DEFAULT_TABS,
  showMoreTabs = false,
  moreCount = 0,
  overflowTabs,
  showAddTab = true,
  footerVariant = 'default',
  showFooter = true,
  showRightSidebar = true,
  pageHeaderTitle = 'Page title',
  pageHeaderSubtitle,
  pageHeaderPrimaryButton,
  pageHeaderOutlineButton1,
  pageHeaderOutlineButton2,
  pageHeaderOutlineButton3,
  pageHeaderShowDefaultButtons = true,
  pageHeaderActions,
  leftSidebarSections,
  rightSidebarSections,
  rightSidebarVariant,
  className = '',
  children,
}: ShellLayoutProps) {
  const isCPVariant = showFloatingNav === true
  const effectiveHasFooter = showFooter
  const effectiveShowFloatingNav = showFloatingNav ?? false
  const effectiveFloatingNavPreset = resolveFloatingNavPreset(floatingNavPreset)

  return (
    <div
      className={clsx('shell-layout', className)}
      data-cp-variant={isCPVariant}
      data-use-theme-detection="false"
    >
      <div
        className="shell-layout__container"
        data-has-footer={String(effectiveHasFooter)}
        data-has-floating-nav={String(effectiveShowFloatingNav)}
        data-has-right-sidebar={String(showRightSidebar)}
        data-footer-variant={footerVariant}
      >
        <ShellHeader
          productName={productName}
          logoSrc={logoSrc}
          companyName={companyName}
          showCompanyPicker={showCompanyPicker}
          companyColor={companyColor}
          companies={companies}
          className="shell-layout__header"
        />

        {effectiveShowFloatingNav && (
          <div className="shell-layout__floating-nav-wrap">
            <FloatingNav
              variant={floatingNavVariant ?? 'full'}
              preset={effectiveFloatingNavPreset}
              showExecute={showExecute}
              saveDisabled={saveDisabled}
            />
          </div>
        )}

        <LeftSidebar
          variant={leftSidebarVariant ?? 'ppm'}
          sections={leftSidebarSections}
          className="shell-layout__left-sidebar"
        />

        {showRightSidebar && (
          <RightSidebar
            variant={rightSidebarVariant ?? 'ppm'}
            sections={rightSidebarSections}
            className="shell-layout__right-sidebar"
          />
        )}

        <main className="shell-layout__main">
          {pageHeaderTitle != null && pageHeaderTitle !== '' && (
            <ShellPageHeader
              title={pageHeaderTitle}
              subtitle={pageHeaderSubtitle}
              showDefaultButtons={pageHeaderShowDefaultButtons}
              primaryButton={pageHeaderPrimaryButton}
              outlineButton1={pageHeaderOutlineButton1}
              outlineButton2={pageHeaderOutlineButton2}
              outlineButton3={pageHeaderOutlineButton3}
              actions={pageHeaderActions}
            />
          )}
          {children ?? (
            <Card primary elevated>
              <div className="card__body">
                <h2 className="text-xl font-semibold mb-2">
                  Page Content Area
                </h2>
                <p className="text-secondary">
                  This is where your application content lives. The shell
                  provides the structure, and you provide the content.
                </p>
              </div>
            </Card>
          )}
        </main>

        {effectiveHasFooter && (
          <ShellFooter
            tabs={tabs}
            showMore={showMoreTabs}
            moreCount={moreCount}
            overflowTabs={overflowTabs ?? []}
            showAddTab={showAddTab}
            variant={footerVariant}
            className="shell-layout__footer"
          />
        )}
      </div>
    </div>
  )
}
