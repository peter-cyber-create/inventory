export default function PageLayout({ title, actions, children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-page-title text-gov-primary font-semibold">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
