/**
 * Button — primary, secondary, or ghost variant.
 * Renders a <button> by default; pass `as="a"` for a link-styled button.
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
