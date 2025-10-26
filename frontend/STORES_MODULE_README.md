# Ministry of Health Uganda - Assets Management Stores Module

## Overview

The Stores Module is a comprehensive ERP solution designed specifically for the Ministry of Health Uganda's inventory management needs. It provides three core functionalities:

1. **GRN (Goods Received Note)** - For receiving and recording goods
2. **Issuance (Requisition/Issue Voucher)** - For requesting and issuing items
3. **Ledger** - For tracking stock movements and balances

## Features

### 🎨 Design System
- **Uganda Flag Colors**: Black, Yellow, Red top stripe on every page
- **Ministry Branding**: Official MoH colors and typography
- **Accessibility**: WCAG AA compliant with high contrast support
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📋 GRN (Goods Received Note)
- **Header Fields**: Contract No., LPO No., Delivery Note No., Tax Invoice No.
- **Auto-generated GRN Numbers**: Unique serial numbers for each GRN
- **Dynamic Item Rows**: Add/remove items with quantities and descriptions
- **File Uploads**: Drag & drop support for Form 5 and technical specifications
- **Digital Signatures**: Canvas-based signature capture for all officers
- **Approval Workflow**: Multi-level approval with status tracking

### 📝 Issuance (Requisition/Issue Voucher)
- **Government Format**: Official Uganda government requisition format
- **Department Management**: Track requests by department/unit
- **Quantity Controls**: Ordered, approved, and issued quantity tracking
- **Multi-level Signatures**: Requisition, Issuing, Receiving, Head of Dept, Approving officers
- **Serial Number Generation**: Auto-generated unique serial numbers

### 📊 Stock Ledger
- **Color-coded Entries**: 
  - Red: Opening stock
  - Green: Received items (from GRN)
  - Black: Issued items (from Issuance)
  - Blue: Closing balance
- **Real-time Updates**: Automatic balance calculations
- **Filtering**: Filter by entry type (opening, received, issued)
- **Summary Cards**: Current stock, total received, total issued, transaction count
- **Export Capabilities**: CSV and PDF export functionality

## Technical Stack

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling with custom design tokens
- **Canvas API** for digital signature capture
- **File API** for drag & drop uploads
- **Responsive Design** with mobile-first approach

### Backend Integration
- **RESTful APIs** for all CRUD operations
- **MySQL Database** with Prisma ORM
- **File Upload Handling** with validation and storage
- **Digital Signature Storage** as base64 or file uploads
- **Role-based Access Control** for different user types

## File Structure

```
src/
├── components/StoresModule/
│   ├── TopStripe.jsx          # Uganda flag color stripe
│   ├── AppShell.jsx           # Main layout with sidebar
│   ├── Uploader.jsx           # Drag & drop file upload
│   ├── SignaturePad.jsx       # Canvas signature capture
│   ├── GRNForm.jsx           # Goods Received Note form
│   ├── IssuanceForm.jsx      # Requisition/Issue Voucher form
│   └── LedgerView.jsx        # Stock ledger with color coding
├── pages/
│   ├── StoresModule.jsx      # Main module with tabs
│   └── StoresDemo.jsx        # Comprehensive demo page
└── theme/
    └── stores-module.css     # Design system and styles
```

## Usage

### Accessing the Module
1. Navigate to `/stores/module` for the main interface
2. Navigate to `/stores/demo` for the comprehensive demo
3. Use the tab navigation to switch between GRN, Issuance, and Ledger

### Creating a GRN
1. Fill in header information (Contract No., LPO No., etc.)
2. Add items with descriptions, units, and quantities
3. Upload required documents (Form 5, specifications)
4. Capture digital signatures from all officers
5. Submit for approval

### Creating an Issuance
1. Select department/unit making the request
2. Add items with quantities (ordered, approved, issued)
3. Capture signatures from all required officers
4. Submit for processing

### Viewing Stock Ledger
1. Select an item to view its ledger
2. Use filters to show specific entry types
3. View color-coded entries with automatic calculations
4. Export data as needed

## API Endpoints

### GRN Endpoints
- `POST /api/stores/grn` - Create new GRN
- `GET /api/stores/grn/:id` - Get GRN details
- `PATCH /api/stores/grn/:id` - Update/approve GRN
- `POST /api/stores/grn/:id/upload` - Upload documents

### Issuance Endpoints
- `POST /api/stores/issuance` - Create new requisition
- `GET /api/stores/issuance/:id` - Get issuance details
- `PATCH /api/stores/issuance/:id` - Update/approve issuance

### Ledger Endpoints
- `GET /api/stores/ledger/:itemId` - Get item ledger
- `POST /api/stores/ledger/recalculate/:itemId` - Recalculate balances

## Database Schema

### GRN Table
```sql
CREATE TABLE grn (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_no VARCHAR(255),
  lpo_no VARCHAR(255),
  delivery_note VARCHAR(255),
  tax_invoice VARCHAR(255),
  grn_no VARCHAR(255) UNIQUE,
  approval_status ENUM('Pending', 'Approved', 'Rejected'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Issuance Table
```sql
CREATE TABLE issuance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  country VARCHAR(255) DEFAULT 'The Republic of Uganda',
  ministry VARCHAR(255) DEFAULT 'Ministry of Health',
  from_dept VARCHAR(255),
  serial_no VARCHAR(255) UNIQUE,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ledger Entries Table
```sql
CREATE TABLE ledger_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT,
  date DATE,
  type ENUM('opening', 'grn', 'issuance'),
  grn_ref VARCHAR(255),
  issuance_ref VARCHAR(255),
  opening_balance INT,
  received INT DEFAULT 0,
  issued INT DEFAULT 0,
  closing_balance INT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Support for high contrast display preferences
- **Focus Indicators**: Clear focus indicators for keyboard users
- **Color Coding Legend**: Visual legend for ledger color coding

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- MySQL 8.0+

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Follow the existing code style and patterns
2. Ensure all components are accessible
3. Test on multiple devices and browsers
4. Update documentation for any new features

## License

This project is developed for the Ministry of Health Uganda and follows their internal licensing terms.

## Support

For technical support or feature requests, contact the development team or create an issue in the project repository.
