import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getComponentByName } from '../componentRegistry'
import { ShellPanel } from '../components/harmony/ShellPanel'

export function ComponentDemoPage() {
  const { componentName } = useParams<{ componentName: string }>()
  const entry = componentName ? getComponentByName(componentName) : undefined

  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  if (!entry) {
    return (
      <div style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
        <p>Component not found: {componentName}</p>
        <Link to="/components" style={{ color: 'var(--link-color)' }}>
          Back to component gallery
        </Link>
      </div>
    )
  }

  const { name, Component, demoProps = {}, fullPage } = entry

  if (fullPage) {
    return (
      <div
        className="full-page-demo-shell-wrap"
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0.5rem 1rem', flexShrink: 0 }}>
          <Link
            to="/components"
            style={{ color: 'var(--link-color)', textDecoration: 'none' }}
          >
            ← Back to gallery
          </Link>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Component {...demoProps} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '56rem', margin: '0 auto' }}>
      <Link
        to="/components"
        style={{ color: 'var(--link-color)', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}
      >
        ← Back to gallery
      </Link>
      <h1 style={{ marginBottom: '1rem' }}>{name}</h1>
      <div
        style={{
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          backgroundColor: name === 'Card' ? 'var(--page-bg)' : 'var(--card-bg)',
        }}
      >
        {name === 'ShellPanel' ? (
          <div
            className="shell-layout"
            style={{
              minHeight: '400px',
              position: 'relative',
              ['--sidebar-width' as string]: '0px',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setLeftPanelOpen(true)}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: '#fff',
                }}
              >
                Open left panel
              </button>
              <button
                type="button"
                onClick={() => setRightPanelOpen(true)}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: '#fff',
                }}
              >
                Open right panel
              </button>
            </div>
            <ShellPanel
              side="left"
              open={leftPanelOpen}
              title="Left Panel"
              onClose={() => setLeftPanelOpen(false)}
            >
              Left panel content. Header and this text should align on the left.
            </ShellPanel>
            <ShellPanel
              side="right"
              open={rightPanelOpen}
              title="Right Panel"
              onClose={() => setRightPanelOpen(false)}
            >
              Right panel content. Header and this text should align on the right.
            </ShellPanel>
          </div>
        ) : (
          <Component {...demoProps} />
        )}
      </div>
    </div>
  )
}
