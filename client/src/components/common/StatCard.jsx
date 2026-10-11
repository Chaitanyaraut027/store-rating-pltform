/**
 * Reusable card displaying an icon, metric label, and numeric or summary value.
 */
export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} color="var(--color-primary)" aria-hidden="true" />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  )
}
