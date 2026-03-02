/**
 * Approval workflow actions for transaction forms.
 * Submit | Approve | Reject (with reason) | Cancel
 * Role-based visibility: show by status and optional canApprove / canEdit.
 */
export default function ApprovalActions({
  status,
  onSubmit,
  onApprove,
  onReject,
  onCancel,
  canEdit = true,
  canApprove = false,
  canSubmit = true,
  submitting = false,
  rejectReason,
  onRejectReasonChange,
  showRejectForm = false,
  onToggleRejectForm,
  className = '',
}) {
  const isDraft = !status || status === 'Draft' || status === 'draft';
  const isSubmitted = status === 'Submitted' || status === 'submitted';
  const isApproved = status === 'Approved' || status === 'approved' || status === 'Completed' || status === 'completed';
  const isRejected = status === 'Rejected' || status === 'rejected';
  const locked = isApproved || isRejected;

  return (
    <div className={`flex flex-wrap items-center gap-3 pt-4 border-t border-gov-border mt-6 ${className}`}>
      {isDraft && canEdit && canSubmit && onSubmit && (
        <button type="button" onClick={onSubmit} disabled={submitting} className="ims-btn-primary">
          {submitting ? 'Submitting…' : 'Submit for approval'}
        </button>
      )}
      {isSubmitted && canApprove && onApprove && (
        <button type="button" onClick={onApprove} disabled={submitting} className="ims-btn-primary">
          {submitting ? 'Processing…' : 'Approve'}
        </button>
      )}
      {isSubmitted && canApprove && onReject && !showRejectForm && (
        <button type="button" onClick={onToggleRejectForm} className="ims-btn-secondary">
          Reject
        </button>
      )}
      {showRejectForm && (
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={rejectReason ?? ''}
            onChange={(e) => onRejectReasonChange?.(e.target.value)}
            placeholder="Rejection reason (required)"
            className="ims-input flex-1 min-w-[200px]"
          />
          <button type="button" onClick={() => onReject?.(rejectReason)} disabled={submitting || !rejectReason?.trim()} className="ims-btn-danger">
            Confirm reject
          </button>
          <button type="button" onClick={onToggleRejectForm} className="ims-btn-secondary">Cancel</button>
        </div>
      )}
      {onCancel && (isDraft || isSubmitted) && (
        <button type="button" onClick={onCancel} className="ims-btn-secondary">
          Cancel
        </button>
      )}
    </div>
  );
}
