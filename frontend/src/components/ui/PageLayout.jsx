export default function PageLayout({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) {
  return (
    <div className={`p-6 ${className}`}>
      <div className="ims-card mb-5 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-page-title text-gov-primary font-semibold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-body-sm text-gov-secondary">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
