# Form 76A - Stores Requisition/Issue Voucher Implementation

## Overview
This implementation provides a complete **Ministry of Health Form 76A** system for stores requisition and issue vouchers. The system includes data entry, workflow management, and PDF generation with physical signature placeholders.

## Features Implemented

### ✅ Backend Features
- **Enhanced Database Models**: Updated requisition, requisition item, and signature models
- **Form 76A API Routes**: Complete CRUD operations with PDF generation
- **Workflow Management**: Draft → Submitted → Printed states
- **PDF Generation**: Official MOH Form 76A layout with signature sections
- **Auto-generated Serial Numbers**: REQ-YYYY-XXXXXX format

### ✅ Frontend Features
- **Dynamic Form Interface**: Add/remove items with validation
- **Workflow Visualization**: Step-by-step progress tracking
- **PDF Download**: Generate and download official forms
- **Status Management**: Update form status through workflow
- **Responsive Design**: Mobile-friendly interface

### ✅ Integration Features
- **Stores Module Integration**: Seamlessly integrated with existing stores system
- **Navigation Integration**: Added to main application menu
- **Service Layer**: Complete API service methods
- **Route Configuration**: Proper routing setup

## Installation & Setup

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install pdfkit@^0.14.0
```

#### Run Database Migration
```bash
# Run the Form 76A migration
npx sequelize-cli db:migrate --name 20250120000001-add-form76a-fields.js
```

#### Start Backend Server
```bash
npm start
# or
npm run server
```

### 2. Frontend Setup

#### Install Dependencies (if needed)
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

### 3. Access the Form 76A System

1. **Navigate to Stores Module**: Go to `/stores` in the application
2. **Access Form 76A**: Click on "Form 76A" in the stores menu
3. **Create New Form**: Click "New Form 76A" button

## Usage Guide

### Creating a Form 76A

1. **Fill Header Information**:
   - Date (auto-filled, editable)
   - From Department/Unit
   - To Store/Receiving Section
   - Purpose/Remarks

2. **Add Items**:
   - Click "Add Item" to add rows
   - Fill in: Description, Unit of Issue, Quantities
   - Items are auto-numbered sequentially

3. **Save Form**:
   - Click "Create Form" to save as draft
   - Serial number is auto-generated (REQ-YYYY-XXXXXX)

### Workflow Management

1. **Draft State**: Form is being prepared, can be edited
2. **Submitted State**: Form is submitted for processing
3. **Printed State**: Form is printed and ready for physical signatures

### PDF Generation

1. **Generate PDF**: Click download icon on any form
2. **Print Form**: PDF includes all data and signature placeholders
3. **Physical Signatures**: Collect signatures manually on printed form

## API Endpoints

### Form 76A Routes (`/api/stores/form76a`)

- `POST /` - Create new Form 76A
- `GET /` - List all forms with pagination
- `GET /:id` - Get specific form details
- `PUT /:id` - Update form
- `PATCH /:id/status` - Update form status
- `GET /:id/pdf` - Generate PDF
- `DELETE /:id` - Delete form

### Request/Response Examples

#### Create Form 76A
```json
POST /api/stores/form76a
{
  "formDate": "2025-01-20",
  "fromDepartment": "Pharmacy",
  "toStore": "Main Store",
  "purposeRemarks": "Monthly stock requisition",
  "items": [
    {
      "description": "Paracetamol 500mg",
      "unitOfIssue": "Box",
      "quantityOrdered": 10,
      "quantityApproved": 0,
      "quantityIssued": 0,
      "quantityReceived": 0
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "message": "Form 76A requisition created successfully",
  "data": {
    "requisition_id": 1,
    "serial_no": "REQ-2025-000001"
  }
}
```

## Database Schema

### Enhanced Tables

#### `requisitions` Table
- `serial_no` - Auto-generated unique identifier
- `form_date` - Form date
- `from_department` - Requesting department
- `to_store` - Target store/section
- `purpose_remarks` - Purpose/remarks text
- `status` - Workflow status (draft/submitted/printed)
- `printed_at` - Timestamp when printed

#### `requisition_items` Table
- `serial_no` - Item sequence number within form
- `description` - Item description
- `unit_of_issue` - Unit of measurement
- `quantity_ordered` - Requested quantity
- `quantity_approved` - Approved quantity
- `quantity_issued` - Issued quantity
- `quantity_received` - Received quantity

#### `requisition_signatures` Table
- `role` - Signature role (requisition_officer, approving_officer, etc.)
- `name` - Physical signature name (filled manually)
- `signature` - Physical signature (filled manually)
- `signed_at` - Date when physically signed

## File Structure

```
backend/
├── models/stores/
│   ├── requisitionModel.js (enhanced)
│   ├── requisitionItemModel.js (enhanced)
│   └── requisitionSignatureModel.js (enhanced)
├── routes/stores/
│   ├── form76aRoutes.js (new)
│   └── index.js (updated)
├── migrations/
│   └── 20250120000001-add-form76a-fields.js (new)
└── package.json (updated with pdfkit)

frontend/
├── src/pages/Stores/
│   └── Form76A.jsx (new)
├── src/services/
│   └── storesService.js (updated)
├── src/Routes/
│   └── StoreRoutes.js (updated)
└── src/modules/
    └── module-integration.js (updated)
```

## Testing the Implementation

### 1. Test Form Creation
- Navigate to `/stores/form76a`
- Create a new form with sample data
- Verify serial number generation

### 2. Test Workflow
- Create form in draft state
- Submit form (status: submitted)
- Mark as printed (status: printed)

### 3. Test PDF Generation
- Generate PDF for any form
- Verify PDF contains all data
- Check signature placeholders

### 4. Test API Endpoints
- Use Postman or similar tool
- Test all CRUD operations
- Verify response formats

## Troubleshooting

### Common Issues

1. **PDF Generation Fails**
   - Ensure PDFKit is installed: `npm install pdfkit`
   - Check server logs for errors

2. **Database Migration Issues**
   - Run migration manually: `npx sequelize-cli db:migrate`
   - Check database connection

3. **Frontend Route Issues**
   - Clear browser cache
   - Restart development server

4. **API Connection Issues**
   - Verify backend server is running
   - Check API base URL configuration

## Support

For issues or questions regarding the Form 76A implementation:

1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure database migrations are applied
4. Test API endpoints independently

## Future Enhancements

Potential improvements for the Form 76A system:

1. **Digital Signatures**: Integration with digital signature services
2. **Email Notifications**: Automated workflow notifications
3. **Bulk Operations**: Batch processing of forms
4. **Advanced Reporting**: Analytics and reporting features
5. **Mobile App**: Dedicated mobile application
6. **Integration**: Connect with external inventory systems

---

**Form 76A Implementation Complete** ✅

The system is now ready for use in the Ministry of Health inventory management workflow.
