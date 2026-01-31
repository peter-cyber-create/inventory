# Frontend Application Documentation

## Overview
The frontend is a React-based single-page application that provides a modern, responsive interface for the Inventory Management System.

## 🏗️ Architecture

### Directory Structure
```
frontend/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── common/         # Common components
│   │   ├── layout/         # Layout components
│   │   ├── forms/          # Form components
│   │   └── tables/         # Table components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── assets/         # Asset management pages
│   │   ├── fleet/          # Fleet management pages
│   │   ├── stores/          # Store management pages
│   │   ├── finance/         # Finance pages
│   │   └── settings/        # Settings pages
│   ├── services/           # API services
│   │   ├── api/            # API calls
│   │   ├── auth/            # Authentication services
│   │   └── notifications/  # Notification services
│   ├── store/              # State management
│   │   ├── slices/         # Redux slices
│   │   └── selectors/      # Redux selectors
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Static assets
│       ├── images/         # Images
│       ├── icons/          # Icons
│       └── styles/         # Stylesheets
├── public/                 # Public static files
├── config/                 # Configuration files
└── docs/                   # Frontend documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm start
```
The application will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🎨 UI Components

### Layout Components
- **Header**: Top navigation bar with user menu
- **Sidebar**: Navigation menu with module access
- **Footer**: Application footer with links
- **TopNavBar**: Role-specific navigation bars

### Common Components
- **FNCard**: Flexible card component
- **FNTable**: Enhanced table with sorting and filtering
- **FNModal**: Modal dialog component
- **FNSpinner**: Loading spinner component
- **FNEmpty**: Empty state component

### Form Components
- **LoginForm**: User authentication form
- **AssetForm**: Asset creation/editing form
- **VehicleForm**: Vehicle management form
- **RequisitionForm**: Store requisition form

## 📱 Pages and Modules

### Authentication
- **Login**: User authentication page
- **Profile**: User profile management

### Dashboard
- **Main Dashboard**: Overview of all modules
- **Module Dashboards**: Specific module dashboards
- **Charts**: Data visualization components

### Asset Management
- **Asset List**: View and manage ICT assets
- **Asset Details**: Detailed asset information
- **Asset Reports**: Asset-related reports
- **Admin Panel**: Asset administration

### Fleet Management
- **Vehicle List**: Vehicle management
- **Job Cards**: Maintenance job cards
- **Service History**: Vehicle service records
- **Spare Parts**: Parts inventory management

### Stores Management
- **Items Management**: Store items inventory
- **Requisitions**: Requisition management
- **Stock Balance**: Stock level monitoring
- **Suppliers**: Supplier management

### Finance Activities
- **Activities**: Financial activity tracking
- **Reports**: Financial reports
- **Users**: User financial management

## 🔧 State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  assets: {
    items: [],
    loading: false,
    error: null
  },
  fleet: {
    vehicles: [],
    jobCards: [],
    loading: false
  },
  stores: {
    items: [],
    requisitions: [],
    loading: false
  },
  finance: {
    activities: [],
    reports: [],
    loading: false
  }
}
```

### Actions and Reducers
- **User Actions**: Authentication and profile management
- **Asset Actions**: Asset CRUD operations
- **Fleet Actions**: Vehicle and maintenance management
- **Store Actions**: Inventory and requisition management
- **Finance Actions**: Activity and report management

## 🎨 Styling and Theming

### Design System
- **Colors**: Consistent color palette
- **Typography**: Font families and sizes
- **Spacing**: Consistent spacing system
- **Icons**: Icon library and usage

### CSS Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach

## 🔌 API Integration

### Service Layer
```javascript
// API service structure
const apiService = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile')
  },
  assets: {
    getAll: () => api.get('/assets'),
    create: (data) => api.post('/assets', data),
    update: (id, data) => api.put(`/assets/${id}`, data),
    delete: (id) => api.delete(`/assets/${id}`)
  }
  // ... other services
}
```

### Error Handling
- Global error boundary
- API error handling
- User-friendly error messages
- Retry mechanisms

## 🧪 Testing

### Testing Setup
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user workflow testing with Cypress

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Mobile-optimized forms
- Responsive tables

## 🚀 Performance

### Optimization
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Bundle analysis

## 🔒 Security

### Authentication
- JWT token management
- Secure token storage
- Automatic token refresh
- Logout on token expiry

### Data Protection
- Input validation
- XSS protection
- CSRF protection
- Secure API communication

## 🛠️ Development

### Code Standards
- ESLint configuration
- Prettier formatting
- Git hooks
- Component documentation

### Development Tools
- React Developer Tools
- Redux DevTools
- Hot reloading
- Source maps

## 📦 Build and Deployment

### Build Process
```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Analyze bundle
npm run analyze
```

### Deployment
- Static file serving
- CDN integration
- Environment configuration
- Performance optimization