import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { RightSidebar } from '../components/harmony/RightSidebar'
import type { RightSidebarSection } from '../components/harmony/RightSidebar'
import { ShellPanel } from '../components/harmony/ShellPanel'
import { useRightSidebarPanel } from '../components/harmony/useRightSidebarPanel'
import './RightSidebarPanelDemosPage.css'

const sectionsA: RightSidebarSection[] = [
  {
    items: [
      { icon: 'bell', label: 'Alerts A', panelTitle: 'Alerts A' },
      { icon: 'cog-6-tooth', label: 'Settings A', panelTitle: 'Settings A' },
    ],
  },
]

const sectionsB: RightSidebarSection[] = [
  {
    items: [
      { icon: 'printer', label: 'Print B', panelTitle: 'Print B' },
      { icon: 'question-mark-circle', label: 'Help B', panelTitle: 'Help B' },
    ],
  },
]

const sectionsGlobal: RightSidebarSection[] = [
  {
    items: [
      { icon: 'share', label: 'Share', panelTitle: 'Share' },
      { icon: 'arrow-up-tray', label: 'Upload', panelTitle: 'Upload' },
    ],
  },
]

function ScopedRailDemo({
  label,
  sections,
}: {
  label: string
  sections: RightSidebarSection[]
}) {
  const scopeRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const p = useRightSidebarPanel({
    shellPanelScopeRef: scopeRef,
    rightPanelRef: panelRef,
    initialTitle: `${label} panel`,
    initialTitleIcon: sections[0].items[0].icon,
  })

  return (
    <div>
      <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{label}</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '0.5rem' }}>
        Scoped <code>data-shell-panel-scope</code> — clicks only open this column&apos;s panel.
      </p>
      <div
        ref={scopeRef}
        data-shell-panel-scope
        className="right-sidebar-panel-demo-shell shell-layout"
      >
        <RightSidebar
          variant="ppm"
          sections={sections}
          panelOpen={p.open}
          activeItemKey={p.activeItemKey}
          onItemActivate={p.handleItemActivate}
          rightPanelRef={panelRef}
          shellPanelScopeRef={scopeRef}
        />
        <ShellPanel
          ref={panelRef}
          side="right"
          open={p.open}
          title={p.title}
          titleIcon={p.titleIcon}
          useGradientHeader={p.useGradientHeader}
          headerVariant="theme"
          width="narrow"
          onClose={p.closePanel}
        >
          <div style={{ padding: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Body for {label}.</p>
          </div>
        </ShellPanel>
      </div>
    </div>
  )
}

function GlobalFallbackDemo() {
  const panelRef = useRef<HTMLDivElement>(null)
  const p = useRightSidebarPanel({
    rightPanelRef: panelRef,
    initialTitle: 'Global panel',
    initialTitleIcon: 'share',
  })

  return (
    <div>
      <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Global fallback</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '0.5rem' }}>
        No scope wrapper and no scope ref — <code>document.querySelector(&apos;.shell-panel--right&apos;)</code>{' '}
        targets the single panel below.
      </p>
      <div className="right-sidebar-panel-global-demo shell-layout">
        <RightSidebar
          variant="ppm"
          sections={sectionsGlobal}
          panelOpen={p.open}
          activeItemKey={p.activeItemKey}
          onItemActivate={p.handleItemActivate}
          rightPanelRef={panelRef}
        />
        <ShellPanel
          ref={panelRef}
          side="right"
          open={p.open}
          title={p.title}
          titleIcon={p.titleIcon}
          useGradientHeader={p.useGradientHeader}
          headerVariant="theme"
          width="narrow"
          onClose={p.closePanel}
        >
          <div style={{ padding: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Global right panel (layout-style app).
            </p>
          </div>
        </ShellPanel>
      </div>
    </div>
  )
}

export function RightSidebarPanelDemosPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/components" style={{ color: 'var(--link-color)', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to gallery
      </Link>
      <h1 style={{ marginBottom: '0.5rem' }}>Right sidebar + ShellPanel</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '48rem' }}>
        Verification: two independent scoped rails (each with its own panel) and a third region using global panel
        resolution with no <code>data-shell-panel-scope</code>.
      </p>

      <div className="right-sidebar-panel-demo-grid" style={{ marginBottom: '2.5rem' }}>
        <ScopedRailDemo label="Column A" sections={sectionsA} />
        <ScopedRailDemo label="Column B" sections={sectionsB} />
      </div>

      <GlobalFallbackDemo />
    </div>
  )
}
