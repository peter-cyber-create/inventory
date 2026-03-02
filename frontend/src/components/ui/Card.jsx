export default function Card({ title, children, className = '' }) {
  return (
    <div className={`ims-card ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gov-borderLight">
          <h2 className="ims-section-title mb-0">{title}</h2>
        </div>
      )}
      <div className={title ? 'p-5' : 'p-5'}>{children}</div>
    </div>
  );
}
