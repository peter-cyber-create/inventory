const bcrypt = require('bcrypt');
const { connectDB, sequelize, DataTypes } = require('./backend/config/db.js');

// User Model
const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: true });

// All module users to create
const users = [
  // Admin users
  {
    username: 'admin',
    email: 'admin@moh.go.ug',
    password: 'admin123',
    role: 'admin',
    firstname: 'System',
    lastname: 'Administrator'
  },
  {
    username: 'superadmin',
    email: 'superadmin@moh.go.ug',
    password: 'superadmin123',
    role: 'admin',
    firstname: 'Super',
    lastname: 'Administrator'
  },
  
  // IT Module Users
  {
    username: 'itadmin',
    email: 'itadmin@moh.go.ug',
    password: 'it@2024',
    role: 'it',
    firstname: 'IT',
    lastname: 'Administrator'
  },
  {
    username: 'ituser',
    email: 'ituser@moh.go.ug',
    password: 'ituser123',
    role: 'it',
    firstname: 'IT',
    lastname: 'User'
  },
  {
    username: 'ictmanager',
    email: 'ictmanager@moh.go.ug',
    password: 'ict@2024',
    role: 'it',
    firstname: 'ICT',
    lastname: 'Manager'
  },
  
  // Fleet/Garage Module Users
  {
    username: 'garageadmin',
    email: 'garageadmin@moh.go.ug',
    password: 'garage@2024',
    role: 'garage',
    firstname: 'Fleet',
    lastname: 'Administrator'
  },
  {
    username: 'garageuser',
    email: 'garageuser@moh.go.ug',
    password: 'garage123',
    role: 'garage',
    firstname: 'Fleet',
    lastname: 'User'
  },
  {
    username: 'mechanic',
    email: 'mechanic@moh.go.ug',
    password: 'mechanic123',
    role: 'garage',
    firstname: 'Vehicle',
    lastname: 'Mechanic'
  },
  
  // Stores Module Users
  {
    username: 'storeadmin',
    email: 'storeadmin@moh.go.ug',
    password: 'store@2024',
    role: 'store',
    firstname: 'Store',
    lastname: 'Administrator'
  },
  {
    username: 'storeuser',
    email: 'storeuser@moh.go.ug',
    password: 'store123',
    role: 'store',
    firstname: 'Store',
    lastname: 'User'
  },
  {
    username: 'storekeeper',
    email: 'storekeeper@moh.go.ug',
    password: 'keeper123',
    role: 'store',
    firstname: 'Store',
    lastname: 'Keeper'
  },
  
  // Finance Module Users
  {
    username: 'financeadmin',
    email: 'financeadmin@moh.go.ug',
    password: 'finance@2024',
    role: 'finance',
    firstname: 'Finance',
    lastname: 'Administrator'
  },
  {
    username: 'financeuser',
    email: 'financeuser@moh.go.ug',
    password: 'finance123',
    role: 'finance',
    firstname: 'Finance',
    lastname: 'User'
  },
  {
    username: 'accountant',
    email: 'accountant@moh.go.ug',
    password: 'account123',
    role: 'finance',
    firstname: 'Senior',
    lastname: 'Accountant'
  }
];

async function createUsers() {
  try {
    await connectDB();
    await sequelize.sync({ force: false });
    
    console.log('🚀 Creating users for all modules...\n');
    
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          where: {
            username: userData.username
          }
        });
        
        if (existingUser) {
          console.log(`⚠️  User ${userData.username} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Create user
        const user = await User.create({
          ...userData,
          password: hashedPassword
        });
        
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        
      } catch (error) {
        console.error(`❌ Error creating user ${userData.username}:`, error.message);
      }
    }
    
    console.log('\n🎉 User creation completed!');
    console.log('\n📋 CREDENTIALS SUMMARY:');
    console.log('='.repeat(50));
    
    // Group by role
    const groupedUsers = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});
    
    Object.entries(groupedUsers).forEach(([role, roleUsers]) => {
      console.log(`\n🔑 ${role.toUpperCase()} MODULE:`);
      roleUsers.forEach(user => {
        console.log(`   Username: ${user.username} | Password: ${user.password}`);
      });
    });
    
    console.log('\n🌐 Access URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createUsers();





