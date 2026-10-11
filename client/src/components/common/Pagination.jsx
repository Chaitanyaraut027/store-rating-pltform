import Button from './Button'

/**
 * Reusable pagination component for navigating multi-page tables and lists.
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--sp-4)',
        marginTop: 'var(--sp-8)',
      }}
    >
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        Previous
      </Button>

      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
      </Button>
    </nav>
  )
}
