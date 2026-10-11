/**
 * Input — labeled text field with optional helper or error message.
 */
export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span aria-hidden="true" style={{ color: 'var(--color-error)', marginLeft: '0.2em' }}>*</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-hint` : undefined}
        className={`input-field${error ? ' input-error' : ''}`}
        {...rest}
      />

      {(error || hint) && (
        <p id={`${id}-hint`} className={`input-hint${error ? ' error' : ''}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
