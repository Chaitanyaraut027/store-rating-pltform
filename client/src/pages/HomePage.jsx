import { Star, Store, Users, ShieldCheck } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/common/Button'

const FEATURES = [
  {
    icon: Store,
    title: 'Store Directory',
    description: 'Browse and discover stores registered on the platform.',
  },
  {
    icon: Star,
    title: 'Honest Ratings',
    description: 'Submit one genuine rating per store and update it any time.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Separate dashboards for users, store owners, and admins.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Default',
    description: 'JWT authentication with role-enforced API access throughout.',
  },
]

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="card">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--color-primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--sp-4)',
      }}>
        <Icon size={20} color="var(--color-primary)" aria-hidden="true" />
      </div>

      <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 'var(--sp-1)' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--sp-16) var(--sp-6)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--sp-4)',
          }}>
            Store Rating Platform
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            marginBottom: 'var(--sp-8)',
          }}>
            Explore stores, submit ratings, and manage your business — all from
            one place.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              See Features
            </Button>
            <Button variant="secondary">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ padding: 'var(--sp-16) var(--sp-6)' }}
      >
        <div className="page-container">
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: 'var(--sp-10)',
          }}>
            What's included
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--sp-5)',
          }}>
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
