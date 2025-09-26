#!/bin/bash

# Ministry of Health Uganda Inventory Management System
# Database Setup Script

echo "🇺🇬 Ministry of Health Uganda - Database Setup"
echo "=============================================="
echo ""

echo "🔧 Setting up MySQL/MariaDB database for MoH Inventory System..."
echo ""

# Check if MySQL/MariaDB is running
if ! systemctl is-active --quiet mariadb && ! systemctl is-active --quiet mysql; then
    echo "❌ MySQL/MariaDB is not running"
    echo "🔧 Starting database service..."
    
    if systemctl list-unit-files | grep -q mariadb; then
        sudo systemctl start mariadb
        sudo systemctl enable mariadb
        echo "✅ MariaDB started"
    elif systemctl list-unit-files | grep -q mysql; then
        sudo systemctl start mysql
        sudo systemctl enable mysql
        echo "✅ MySQL started"
    else
        echo "❌ No MySQL/MariaDB service found"
        echo "Please install MySQL or MariaDB:"
        echo "  sudo apt update"
        echo "  sudo apt install mariadb-server"
        exit 1
    fi
fi

echo ""
echo "📋 Database Setup Options:"
echo "1. Use root with no password (development only)"
echo "2. Create dedicated database user (recommended)"
echo "3. Manual setup instructions"
echo ""
read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "🔧 Setting up with root user (no password)..."
        sudo mariadb -e "
            CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            CREATE DATABASE IF NOT EXISTS inventory_db_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            SHOW DATABASES;
        " 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Databases created successfully"
            echo ""
            echo "📝 Environment Configuration:"
            echo "DB_HOST=localhost"
            echo "DB_PORT=3306"
            echo "DB_NAME=inventory_db"
            echo "DB_USER=root"
            echo "DB_PASS="
        else
            echo "❌ Failed to create databases with root access"
        fi
        ;;
    2)
        echo "🔧 Creating dedicated database user..."
        read -p "Enter username for database user [inventory_user]: " db_user
        db_user=${db_user:-inventory_user}
        
        read -s -p "Enter password for database user: " db_pass
        echo ""
        
        sudo mariadb -e "
            CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            CREATE DATABASE IF NOT EXISTS inventory_db_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            CREATE USER IF NOT EXISTS '${db_user}'@'localhost' IDENTIFIED BY '${db_pass}';
            GRANT ALL PRIVILEGES ON inventory_db.* TO '${db_user}'@'localhost';
            GRANT ALL PRIVILEGES ON inventory_db_test.* TO '${db_user}'@'localhost';
            FLUSH PRIVILEGES;
            SHOW DATABASES;
        " 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Database and user created successfully"
            echo ""
            echo "📝 Environment Configuration:"
            echo "DB_HOST=localhost"
            echo "DB_PORT=3306"
            echo "DB_NAME=inventory_db"
            echo "DB_USER=${db_user}"
            echo "DB_PASS=${db_pass}"
            echo ""
            echo "💡 Update your .env file with these credentials"
        else
            echo "❌ Failed to create database and user"
        fi
        ;;
    3)
        echo "📋 Manual Setup Instructions:"
        echo ""
        echo "1. Connect to MySQL/MariaDB as root:"
        echo "   sudo mariadb"
        echo ""
        echo "2. Run these SQL commands:"
        echo "   CREATE DATABASE inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo "   CREATE DATABASE inventory_db_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo "   CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'your_password';"
        echo "   GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';"
        echo "   GRANT ALL PRIVILEGES ON inventory_db_test.* TO 'inventory_user'@'localhost';"
        echo "   FLUSH PRIVILEGES;"
        echo "   EXIT;"
        echo ""
        echo "3. Update the .env file in inventory-backend-master/ with your credentials"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🔄 Next Steps:"
echo "1. Update .env file with database credentials"
echo "2. Start backend: ./start-backend.sh"
echo "3. Start frontend: ./start-frontend.sh"
echo ""
echo "✅ Database setup complete!"

