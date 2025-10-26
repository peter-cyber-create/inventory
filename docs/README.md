# Inventory Management System

A comprehensive inventory management system built with React frontend and Node.js backend, designed for managing ICT assets, fleet vehicles, stores, and financial activities.

## 🏗️ Project Structure

```
inventory/
├── backend/                 # Backend API application
│   ├── src/                # Source code
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Input validation
│   ├── config/             # Configuration files
│   ├── models/             # Database models
│   │   ├── assets/         # Asset-related models
│   │   ├── users/          # User models
│   │   ├── stores/         # Store models
│   │   ├── fleet/          # Fleet models
│   │   └── finance/        # Finance models
│   ├── routes/             # API routes
│   │   ├── api/            # API routes
│   │   └── v1/             # Version 1 routes
│   ├── middleware/         # Express middleware
│   ├── tests/              # Test files
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # Integration tests
│   │   └── e2e/            # End-to-end tests
│   ├── uploads/            # File uploads
│   └── docs/               # Backend documentation
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── common/     # Common components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── forms/      # Form components
│   │   │   └── tables/     # Table components
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── dashboard/  # Dashboard pages
│   │   │   ├── assets/     # Asset management pages
│   │   │   ├── fleet/      # Fleet management pages
│   │   │   ├── stores/     # Store management pages
│   │   │   ├── finance/    # Finance pages
│   │   │   └── settings/   # Settings pages
│   │   ├── services/       # API services
│   │   │   ├── api/        # API calls
│   │   │   ├── auth/       # Authentication services
│   │   │   └── notifications/ # Notification services
│   │   ├── store/          # State management
│   │   │   ├── slices/     # Redux slices
│   │   │   └── selectors/  # Redux selectors
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Static assets
│   │       ├── images/     # Images
│   │       ├── icons/      # Icons
│   │       └── styles/     # Stylesheets
│   ├── public/             # Public static files
│   ├── config/             # Configuration files
│   └── docs/               # Frontend documentation
├── database/               # Database related files
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Database seeds
│   └── schemas/            # Database schemas
├── docs/                   # Project documentation
│   ├── api/                # API documentation
│   │   ├── endpoints/      # API endpoint docs
│   │   ├── authentication/ # Auth documentation
│   │   └── examples/        # API examples
│   ├── deployment/         # Deployment guides
│   │   ├── production/     # Production deployment
│   │   ├── staging/        # Staging deployment
│   │   └── development/    # Development setup
│   ├── development/        # Development guides
│   │   ├── setup/          # Setup instructions
│   │   ├── contributing/  # Contributing guidelines
│   │   └── coding-standards/ # Coding standards
│   └── user-guide/         # User documentation
├── scripts/                # Utility scripts
│   ├── setup/              # Setup scripts
│   ├── deployment/         # Deployment scripts
│   ├── maintenance/        # Maintenance scripts
│   └── testing/            # Testing scripts
├── config/                 # Configuration files
│   ├── environments/       # Environment configs
│   ├── secrets/            # Secret management
│   ├── nginx/               # Nginx configs
│   └── docker/             # Docker configs
└── deployment/             # Deployment files
    ├── docker/             # Docker files
    ├── kubernetes/         # K8s manifests
    └── scripts/            # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL/MariaDB or PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Setup database**
   ```bash
   # Run the database setup script
   ./scripts/setup/setup-database.sh
   ```

4. **Start the application**
   ```bash
   # Start backend and frontend
   ./scripts/setup/start-application.sh
   ```

## 📋 Features

### Core Modules
- **ICT Assets Management**: Track and manage IT equipment, servers, and devices
- **Fleet Management**: Vehicle tracking, maintenance, and job cards
- **Stores Management**: Inventory, requisitions, and stock management
- **Finance Activities**: Financial tracking and reporting
- **User Management**: Role-based access control

### Key Features
- ✅ Modern React frontend with responsive design
- ✅ RESTful API with Express.js
- ✅ Database integration with Sequelize ORM
- ✅ JWT authentication and authorization
- ✅ File upload and management
- ✅ Comprehensive reporting system
- ✅ Role-based access control
- ✅ Audit logging and tracking

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Run linting
```

### Frontend Development
```bash
cd frontend
npm start           # Start development server
npm test            # Run tests
npm run build       # Build for production
```

## 📚 Documentation

- [API Documentation](api/)
- [Deployment Guide](deployment/)
- [Development Setup](development/)
- [User Guide](user-guide/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the documentation or create an issue in the repository.