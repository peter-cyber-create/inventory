export default function Modal({ title, onClose, children, width = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gov-primary/20"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close"
      />
      <div
        className={`relative bg-gov-surface border border-gov-border rounded-card shadow-card w-full ${width} max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gov-borderLight shrink-0">
          <h2 className="text-heading text-gov-primary font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gov-secondary hover:bg-gov-backgroundAlt rounded-form focus:outline-none focus:ring-1 focus:ring-gov-border"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
