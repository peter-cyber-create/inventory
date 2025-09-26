#!/bin/bash

# Ministry of Health Uganda - Inventory Management System
# Production Setup Script

echo "======================================================"
echo "Ministry of Health Uganda - Inventory Management System"
echo "Production Setup Script"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if MySQL is installed
check_mysql() {
    print_header "Checking MySQL installation..."
    if ! command -v mysql &> /dev/null; then
        print_error "MySQL is not installed. Please install MySQL first."
        exit 1
    fi
    print_status "MySQL is installed ✓"
}

# Check if Node.js is installed
check_nodejs() {
    print_header "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed: $NODE_VERSION ✓"
}

# Check if npm is installed
check_npm() {
    print_header "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION ✓"
}

# Setup database
setup_database() {
    print_header "Setting up database..."
    
    echo "Please enter MySQL root password:"
    read -s MYSQL_ROOT_PASSWORD
    
    # Test MySQL connection
    if ! mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; then
        print_error "Failed to connect to MySQL. Please check your credentials."
        exit 1
    fi
    
    print_status "MySQL connection successful ✓"
    
    # Create database and user
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS inventory_db;
CREATE USER IF NOT EXISTS 'inventory_user'@'localhost' IDENTIFIED BY 'inventory_pass';
GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    if [ $? -eq 0 ]; then
        print_status "Database and user created successfully ✓"
    else
        print_error "Failed to create database or user"
        exit 1
    fi
    
    # Initialize database with complete schema
    print_status "Initializing database schema..."
    mysql -u inventory_user -pinventory_pass inventory_db < complete-database-init.sql
    
    if [ $? -eq 0 ]; then
        print_status "Database schema initialized successfully ✓"
    else
        print_error "Failed to initialize database schema"
        exit 1
    fi
}

# Install backend dependencies
setup_backend() {
    print_header "Setting up backend..."
    
    cd inventory-backend-master
    
    if [ ! -f package.json ]; then
        print_error "package.json not found in backend directory"
        exit 1
    fi
    
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed successfully ✓"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Ensure .env file exists
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp environment.example .env
        
        # Update .env for production
        sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env
        sed -i 's/your_super_secure_jwt_secret_key_here_change_in_production/moh_uganda_inventory_super_secure_jwt_key_2025_production/' .env
    fi
    
    print_status "Backend setup completed ✓"
    cd ..
}

# Install frontend dependencies
setup_frontend() {
    print_header "Setting up frontend..."
    
    cd inventory-frontend-master
    
    if [ ! -f package.json ]; then
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully ✓"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    print_status "Frontend setup completed ✓"
    cd ..
}

# Download Uganda Coat of Arms
setup_logo() {
    print_header "Setting up Uganda Coat of Arms logo..."
    
    # Create a proper Uganda coat of arms SVG
    cat > inventory-frontend-master/public/uganda-coat-of-arms.svg << 'EOF'
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Uganda Flag Colors: Black, Yellow, Red -->
  <defs>
    <radialGradient id="shieldGradient" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
    </radialGradient>
    <linearGradient id="craneGradient" cx="50%" cy="0%" fx="50%" fy="0%">
      <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Shield Background -->
  <path d="M60 10 L30 25 L30 85 L60 110 L90 85 L90 25 Z" 
        fill="url(#shieldGradient)" 
        stroke="#000" 
        stroke-width="2"/>
  
  <!-- Uganda Flag Stripes -->
  <rect x="35" y="30" width="50" height="6" fill="#000"/>
  <rect x="35" y="36" width="50" height="6" fill="#FFD700"/>
  <rect x="35" y="42" width="50" height="6" fill="#FF0000"/>
  <rect x="35" y="48" width="50" height="6" fill="#000"/>
  <rect x="35" y="54" width="50" height="6" fill="#FFD700"/>
  <rect x="35" y="60" width="50" height="6" fill="#FF0000"/>
  
  <!-- Crested Crane (simplified) -->
  <circle cx="60" cy="80" r="8" fill="url(#craneGradient)" stroke="#000"/>
  <path d="M60 72 L58 76 L62 76 Z" fill="#FFD700"/>
  <circle cx="57" cy="75" r="1" fill="#000"/>
  <circle cx="63" cy="75" r="1" fill="#000"/>
  
  <!-- Crown -->
  <path d="M50 20 L55 15 L60 20 L65 15 L70 20 L65 25 L55 25 Z" 
        fill="#FFD700" 
        stroke="#000" 
        stroke-width="1"/>
  
  <!-- Spears -->
  <line x1="40" y1="15" x2="42" y2="35" stroke="#8B4513" stroke-width="2"/>
  <line x1="78" y1="15" x2="80" y2="35" stroke="#8B4513" stroke-width="2"/>
  <path d="M40 15 L38 10 L42 10 Z" fill="#C0C0C0"/>
  <path d="M78 15 L76 10 L80 10 Z" fill="#C0C0C0"/>
  
  <!-- Banner -->
  <rect x="25" y="95" width="70" height="15" fill="#FFD700" stroke="#000"/>
  <text x="60" y="105" text-anchor="middle" font-family="serif" font-size="8" fill="#000">
    FOR GOD AND MY COUNTRY
  </text>
</svg>
EOF
    
    print_status "Uganda Coat of Arms logo created ✓"
}

# Create startup scripts
create_scripts() {
    print_header "Creating startup scripts..."
    
    # Backend startup script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting Ministry of Health Uganda - Inventory Backend..."
cd inventory-backend-master
npm start
EOF
    chmod +x start-backend.sh
    
    # Frontend startup script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Ministry of Health Uganda - Inventory Frontend..."
cd inventory-frontend-master
npm start
EOF
    chmod +x start-frontend.sh
    
    # Production backend script
    cat > start-backend-prod.sh << 'EOF'
#!/bin/bash
echo "Starting Ministry of Health Uganda - Inventory Backend (Production)..."
cd inventory-backend-master
NODE_ENV=production npm start
EOF
    chmod +x start-backend-prod.sh
    
    # Build frontend for production
    cat > build-frontend.sh << 'EOF'
#!/bin/bash
echo "Building Ministry of Health Uganda - Inventory Frontend for Production..."
cd inventory-frontend-master
npm run build
echo "Frontend built successfully! Files are in the 'build' directory."
EOF
    chmod +x build-frontend.sh
    
    print_status "Startup scripts created ✓"
}

# Main setup function
main() {
    echo
    print_header "Starting Ministry of Health Uganda Inventory Management System Setup"
    echo
    
    # Check prerequisites
    check_mysql
    check_nodejs
    check_npm
    
    echo
    print_header "Setting up project components..."
    
    # Setup database
    setup_database
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Setup logo
    setup_logo
    
    # Create scripts
    create_scripts
    
    echo
    print_status "======================================================"
    print_status "SETUP COMPLETED SUCCESSFULLY!"
    print_status "======================================================"
    echo
    print_status "Your Ministry of Health Uganda Inventory Management System is ready!"
    echo
    print_status "To start the application:"
    print_status "1. Backend: ./start-backend.sh"
    print_status "2. Frontend: ./start-frontend.sh"
    echo
    print_status "For production:"
    print_status "1. Build frontend: ./build-frontend.sh"
    print_status "2. Start backend: ./start-backend-prod.sh"
    echo
    print_status "Default login credentials:"
    print_status "- Admin: admin / admin123"
    print_status "- IT Manager: it_manager / admin123"
    print_status "- Fleet Manager: fleet_manager / admin123"
    print_status "- Store Manager: store_manager / admin123"
    print_status "- Finance Manager: finance_manager / admin123"
    echo
    print_status "Access the application at: http://localhost:3000"
    print_status "Backend API at: http://localhost:5000"
    echo
}

# Run main function
main "$@"
