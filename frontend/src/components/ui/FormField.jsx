export default function FormField({
  label,
  required,
  error,
  hint,
  children,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label className={`ims-label ${required ? 'ims-label-required' : ''}`}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-body-xs text-gov-secondaryMuted">{hint}</p>}
      {error && <p className="mt-1 text-body-sm text-gov-danger">{error}</p>}
    </div>
  );
}
