import { Link } from 'react-router-dom'

/**
 * Reusable Button component supporting primary, secondary, and ghost variants.
 * Supports rendering as a native <button>, React Router <Link> (via `to`),
 * or external anchor tag (via `href`).
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  to,
  href,
  onClick,
  ...rest
}) {
  const combinedClassName = `btn btn-${variant} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={combinedClassName} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedClassName} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </button>
  )
}
