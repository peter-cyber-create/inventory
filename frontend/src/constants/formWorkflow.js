/**
 * Shared workflow status and role interaction for enterprise transaction forms.
 */

export const DOC_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
};

export const DOC_STATUS_OPTIONS = [
  { value: DOC_STATUS.DRAFT, label: 'Draft' },
  { value: DOC_STATUS.SUBMITTED, label: 'Submitted' },
  { value: DOC_STATUS.APPROVED, label: 'Approved' },
  { value: DOC_STATUS.REJECTED, label: 'Rejected' },
  { value: DOC_STATUS.COMPLETED, label: 'Completed' },
];

/**
 * Role interaction: who can do what by status.
 * Creator: edit in Draft, submit.
 * Approver: approve/reject when Submitted.
 * Viewer: read-only when Approved/Rejected/Completed.
 */
export function canEdit(status, isCreator) {
  const s = (status || '').toLowerCase();
  return (s === 'draft' || s === '') && isCreator;
}

export function canSubmit(status, isCreator) {
  const s = (status || '').toLowerCase();
  return (s === 'draft' || s === '') && isCreator;
}

export function canApprove(status, isApprover) {
  const s = (status || '').toLowerCase();
  return s === 'submitted' && isApprover;
}

export function isLocked(status) {
  const s = (status || '').toLowerCase();
  return ['submitted', 'approved', 'rejected', 'completed'].includes(s);
}
