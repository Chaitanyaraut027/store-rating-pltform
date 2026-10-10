import { Star, Store, Users, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Store,
    title: 'Store Directory',
    description: 'Browse and discover stores registered on the platform.',
  },
  {
    icon: Star,
    title: 'Honest Ratings',
    description: 'Submit a single, genuine rating per store and update it any time.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Separate dashboards for users, store owners, and administrators.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Verified',
    description: 'JWT-protected endpoints with role-based access control throughout.',
  },
]

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── Navigation bar ── */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 var(--space-6)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Store size={22} color="var(--color-blue-500)" />
            <span style={{
              fontWeight: 700,
              fontSize: '1.0625rem',
              color: 'var(--color-navy-900)',
              letterSpacing: '-0.01em',
            }}>
              Store Rating Platform
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {/* Auth links will be wired up in Step 2 */}
            <a href="#features" style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 150ms ease',
            }}>
              Features
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <main style={{ flex: 1 }}>
        <section style={{
          background: 'linear-gradient(160deg, #f0f7ff 0%, var(--color-surface) 60%)',
          padding: 'var(--space-16) var(--space-6)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: 'var(--color-navy-900)',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              marginBottom: 'var(--space-4)',
            }}>
              Store Rating{' '}
              <span style={{ color: 'var(--color-blue-500)' }}>Platform</span>
            </h1>

            <p style={{
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: 'var(--space-8)',
              maxWidth: '520px',
              margin: '0 auto var(--space-8)',
            }}>
              A full-stack web application where users can explore stores and
              submit ratings, owners track their feedback, and administrators
              manage the entire platform.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <a href="#features" className="btn btn-primary">
                Explore Features
              </a>
              <a href="#features" className="btn btn-outline">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section
          id="features"
          style={{
            padding: 'var(--space-16) var(--space-6)',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-navy-900)',
            textAlign: 'center',
            marginBottom: 'var(--space-12)',
            letterSpacing: '-0.015em',
          }}>
            What this platform offers
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}>
                  <Icon size={22} color="var(--color-blue-500)" />
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-navy-900)',
                  marginBottom: 'var(--space-2)',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-6)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
      }}>
        Store Rating Platform &mdash; Internship Assignment
      </footer>
    </div>
  )
}
