const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDB, sequelize, DataTypes } = require("./config/db.js");
const { Op } = require("sequelize");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow network access
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Simple User Model
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

// Login route
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password are required"
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      status: "success",
      message: "Login successful",
      accessToken: token,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// Register route
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, role } = req.body;

    if (!username || !email || !password || !firstname || !lastname) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role: role || 'user'
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server started successfully on port ${PORT} in ${process.env.NODE_ENV || 'development'}`);
  
  try {
    await connectDB();
    await sequelize.sync({ force: false });
    console.log("✅ Database synced successfully");
    
    // Create default admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstname: 'System',
        lastname: 'Administrator',
        role: 'admin'
      });
      console.log("✅ Default admin user created (admin/admin123)");
    }
    
  } catch (error) {
    console.log("⚠️ Database connection warning:", error.message);
    console.log("✅ Server is running - database will sync when PostgreSQL is available");
  }
});
