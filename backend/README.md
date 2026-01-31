# Backend API Documentation

## Overview
The backend API provides RESTful endpoints for the Inventory Management System, built with Node.js, Express.js, and Sequelize ORM.

## 🏗️ Architecture

### Directory Structure
```
backend/
├── src/                    # Source code
│   ├── controllers/        # Route controllers
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── validators/        # Input validation
├── config/                # Configuration files
├── models/                # Database models
│   ├── assets/            # Asset-related models
│   ├── users/             # User models
│   ├── stores/            # Store models
│   ├── fleet/             # Fleet models
│   └── finance/            # Finance models
├── routes/                # API routes
│   ├── api/               # API routes
│   └── v1/                # Version 1 routes
├── middleware/            # Express middleware
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── uploads/               # File uploads
└── docs/                  # Backend documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL 12+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Environment Setup
Create `config/environments/backend.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your_secure_password
SECRETKEY=your_jwt_secret_min_64_chars
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

### Running the Server
```bash
# Development
npm run dev

# Production
npm start

# With PM2
pm2 start index.js --name "inventory-api"
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Assets Management
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Fleet Management
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Stores Management
- `GET /api/stores/items` - Get store items
- `POST /api/stores/items` - Create store item
- `GET /api/stores/requisitions` - Get requisitions
- `POST /api/stores/requisitions` - Create requisition

### Finance Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create new activity
- `GET /api/activities/:id` - Get activity by ID
- `PUT /api/activities/:id` - Update activity

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL. Configure your database connection in `config/environments/backend.env` and `config/config.json`.

### Middleware
- **Authentication**: JWT-based authentication
- **CORS**: Cross-origin resource sharing
- **Body Parser**: JSON and URL-encoded data parsing
- **File Upload**: Multer for file uploads

### Security
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation and sanitization

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows

## 📊 Database Models

### Core Models
- **Users**: User authentication and profiles
- **Assets**: ICT equipment and devices
- **Vehicles**: Fleet vehicles and maintenance
- **Stores**: Inventory items and requisitions
- **Activities**: Financial activities and reporting

### Relationships
- Users can have multiple assets assigned
- Vehicles can have multiple maintenance records
- Stores can have multiple items and requisitions
- Activities are linked to users and departments

## 🔍 Logging and Monitoring

### Audit Logging
All database operations are logged for audit purposes:
- User actions
- Data modifications
- System events
- Security events

### Error Handling
- Centralized error handling
- Detailed error logging
- User-friendly error messages
- Stack trace logging in development

## 🚀 Deployment

### Production Setup
1. Set up environment variables
2. Configure database connection
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

### Docker Deployment
```bash
# Build Docker image
docker build -t inventory-api .

# Run container
docker run -p 5000:5000 inventory-api
```

## 📈 Performance

### Optimization
- Database query optimization
- Caching strategies
- Connection pooling
- Response compression

### Monitoring
- API response times
- Database query performance
- Memory usage
- Error rates

## 🛠️ Development

### Code Standards
- ESLint configuration
- Prettier formatting
- Git hooks for code quality
- Consistent naming conventions

### API Documentation
- Swagger/OpenAPI documentation
- Postman collection
- Example requests and responses
- Error code documentation