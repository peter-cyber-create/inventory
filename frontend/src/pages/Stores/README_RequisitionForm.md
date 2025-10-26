# Stores Requisition / Issue Voucher Form

## Overview

This document describes the implementation of the official Stores Requisition / Issue Voucher form for the Ministry of Health, Uganda inventory management system. The form follows the exact specifications provided and matches the official government document format.

## Form Structure

### Header Information
- **Country**: The Republic of Uganda
- **Ministry/Department**: Ministry of Health
- **From Dept/Unit**: [Dropdown selection of departments]
- **Serial No.**: [Auto-generated or manually input]
- **Date**: [DD/MM/YYYY format]

### Item Table
The form includes a dynamic table with the following columns:
1. **Item No.**: Sequential numbering (1, 2, 3, etc.)
2. **Description of Item**: Text area for item description
3. **Unit of Issue**: Dropdown with common units (PCS, KG, LTR, BOX, SET, PAIR, MTR, SQM)
4. **Quantity Ordered**: Numeric input for requested quantity
5. **Quantity Approved**: Numeric input for approved quantity
6. **Quantity Issued**: Numeric input for issued quantity

## Features

### Form Functionality
- **Auto-initialization**: Form starts with 5 empty rows as specified
- **Dynamic rows**: Users can add/remove rows as needed
- **Validation**: Required field validation for department, serial number, and date
- **Preview**: Preview functionality to see the form before submission
- **Print**: Print functionality for physical copies
- **Save**: Save functionality with API integration

### User Interface
- **Official styling**: Matches government document format
- **Responsive design**: Works on different screen sizes
- **Professional appearance**: Clean, official-looking interface
- **User-friendly**: Intuitive form controls and navigation

## Technical Implementation

### Frontend Components
- **File**: `StoresRequisitionFormPage.jsx`
- **Location**: `src/pages/stores/StoresRequisitionFormPage.jsx`
- **Dependencies**: React, Ant Design, Day.js

### Backend Integration
- **API Endpoint**: `/stores/requisition-form`
- **Service**: `storesService.createRequisitionForm()`
- **Model**: Uses existing `requisitionModel` and `requisitionItemModel`

### Routing
- **Route**: `/stores/requisition-form`
- **Access**: Available to users with 'store' or 'admin' roles
- **Navigation**: Accessible from the main Requisitions page

## Usage Instructions

### Accessing the Form
1. Navigate to the Stores module
2. Go to the Requisitions page
3. Click the "Official Form" button
4. The form will open in a new tab

### Filling Out the Form
1. **Select Department**: Choose the requesting department from the dropdown
2. **Enter Serial Number**: Use the auto-generated number or enter manually
3. **Select Date**: Choose the requisition date
4. **Add Items**: Fill in the item details for each row
5. **Review**: Use the Preview button to review the form
6. **Submit**: Click Save Requisition to submit

### Form Controls
- **Add Row**: Click "Add Row" to add more item lines
- **Remove Row**: Click the delete icon to remove a row (minimum 1 row required)
- **Preview**: Click "Preview" to see the formatted form
- **Print**: Click "Print" to print the form
- **Save**: Click "Save Requisition" to submit the form

## Data Flow

### Form Submission
1. User fills out the form
2. Form validates required fields
3. Data is structured according to the API specification
4. Request is sent to `/stores/requisition-form` endpoint
5. Backend processes and stores the data
6. Success/error message is displayed to user

### Data Structure
```javascript
{
  serialNo: "REQ-1234567890",
  fromDept: "ICT Department",
  date: "2024-01-15",
  items: [
    {
      itemNo: 1,
      description: "Laptop Computer",
      unitOfIssue: "PCS",
      quantityOrdered: 5,
      quantityApproved: 5,
      quantityIssued: 0
    }
  ],
  signatures: []
}
```

## Integration Points

### Existing Systems
- **Stores Service**: Integrated with existing stores service
- **Requisition Model**: Uses existing database models
- **Authentication**: Respects existing role-based access control
- **Navigation**: Integrated with existing stores navigation

### Future Enhancements
- **Approval Workflow**: Can be extended with approval signatures
- **PDF Generation**: Can be enhanced with PDF export functionality
- **Email Integration**: Can be extended with email notifications
- **Audit Trail**: Can be enhanced with detailed audit logging

## Troubleshooting

### Common Issues
1. **Form not loading**: Check if user has proper role permissions
2. **Save failing**: Check network connection and API availability
3. **Validation errors**: Ensure all required fields are filled
4. **Print issues**: Check browser print settings

### Support
For technical support or issues with the form, contact the development team or refer to the main system documentation.

## Version History
- **v1.0**: Initial implementation with basic form functionality
- **v1.1**: Added preview and print functionality
- **v1.2**: Enhanced validation and error handling


