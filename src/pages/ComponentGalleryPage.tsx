import { Link } from 'react-router-dom'
import { componentRegistry } from '../componentRegistry'

export function ComponentGalleryPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Component gallery</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Converted Harmony components. Click a component to view its demo page.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/demos/right-sidebar-panels"
          style={{ color: 'var(--link-color)', textDecoration: 'none', fontWeight: 600 }}
        >
          Right sidebar + ShellPanel verification (scoped + global)
        </Link>
      </p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
          {componentRegistry.map(({ name }) => (
            <li key={name}>
              <Link
                to={`/components/${name}`}
                style={{ color: 'var(--link-color)', textDecoration: 'none' }}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
