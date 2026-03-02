import { useState } from 'react';

/**
 * Collapsible form section (Section A, B, C...) for structured transaction forms.
 */
export default function FormSectionCollapsible({ id, title, defaultOpen = true, children, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gov-border rounded-form mb-4 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gov-backgroundAlt text-left hover:bg-gov-background/80 transition-colors"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-heading-sm text-gov-primary font-medium">{title}</span>
        <svg
          className={`w-5 h-5 text-gov-secondary transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div id={id} className="px-4 py-4 bg-gov-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </div>
      )}
    </div>
  );
}
