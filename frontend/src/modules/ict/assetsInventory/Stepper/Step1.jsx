import FormSectionCollapsible from '../../../../components/ui/FormSectionCollapsible';
import FormField from '../../../../components/ui/FormField';

export default function Step1AssignedUser({ formData, onChange }) {
  return (
    <FormSectionCollapsible
      id="ict-add-asset-step1"
      title="Step 1 – Assigned user information"
      defaultOpen
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Assigned user (name)" required>
          <input
            type="text"
            required
            value={formData.user}
            onChange={(e) => onChange({ ...formData, user: e.target.value })}
            className="ims-input"
          />
        </FormField>
        <FormField label="Purchase date" required>
          <input
            type="date"
            required
            value={formData.purchaseDate}
            onChange={(e) => onChange({ ...formData, purchaseDate: e.target.value })}
            className="ims-input"
          />
        </FormField>
        <FormField label="Department / office / project" required>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => onChange({ ...formData, department: e.target.value })}
            className="ims-input"
          />
        </FormField>
        <FormField label="User job post / title">
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => onChange({ ...formData, jobTitle: e.target.value })}
            className="ims-input"
          />
        </FormField>
        <FormField label="User email">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            className="ims-input"
          />
        </FormField>
        <FormField label="Phone number">
          <input
            type="tel"
            value={formData.phoneNo}
            onChange={(e) => onChange({ ...formData, phoneNo: e.target.value })}
            className="ims-input"
          />
        </FormField>
      </div>
    </FormSectionCollapsible>
  );
}

