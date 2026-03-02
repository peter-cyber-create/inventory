export default function FormSection({ title, children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h3 className="text-heading-sm text-gov-primary mb-3 font-semibold">{title}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
