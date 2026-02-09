
const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectDB, sequelize } = require("./config/db.js");

// Security middleware
const { 
    generalLimiter, 
    authLimiter, 
    uploadLimiter, 
    securityHeaders, 
    corsOptions, 
    validateInput, 
    requestLogger, 
    errorHandler 
} = require("./middleware/security.js");

// Load environment variables
dotenv.config({ path: '../config/environments/backend.env' });

const uploadRoutes = require("./routes/uploads/index.js");
const userRoutes = require("./routes/users/userRoutes.js");
const staffRoutes = require("./routes/users/staffRoutes.js");
const downloadRoutes = require("./routes/downloads/index.js");
const activityRoutes = require("./routes/activity/activityRoutes.js");
const reportRoutes = require('./routes/activity/reportRoutes.js');

// ICT Models
const typeRoutes = require("./routes/categories/ictTypes.js");
const brandRoutes = require("./routes/categories/brandRoutes.js");
const modelRoutes = require("./routes/categories/modelRoutes.js");
const ictIssue = require("./routes/assets/issueRoutes.js");
const deptRoutes = require("./routes/categories/deptRoutes.js");
const divisionRoutes = require("./routes/categories/divisionRoutes.js");
const facilityRoutes = require("./routes/categories/facilityRoutes.js");
const categoryRoutes = require("./routes/categories/categoryRoutes.js");
const assetRoutes = require("./routes/assets/assetsRoutes.js");
const dispatchRoutes = require("./routes/assets/dispatchRoutes.js");
const requisitionRoutes = require("./routes/assets/requisition.js");
const transferRoutes = require("./routes/assets/tranferRoutes.js");
const maintenance = require("./routes/assets/maintenanceRoutes.js");
const disposalRoutes = require("./routes/assets/DisposalRoutes.js");
const serverRoutes = require("./routes/servers/serverRoutes.js");

// Vehicles Routes
const VehicleType = require("./routes/vehicles/vTypes.js");
const VehicleMake = require("./routes/vehicles/vMake.js");
const VehicleGarage = require("./routes/vehicles/vGarage.js");
const VehicleDriver = require("./routes/vehicles/vDriver.js");
const vehicleRoutes = require("./routes/vehicles/vehicleRoutes.js");
const SpareCategory = require("./routes/vehicles/vSpareCategory.js");
const vehicleSpareParts = require("./routes/vehicles/vSpareParts.js");
const vehicleSparePartsQty = require("./routes/vehicles/vSpareQty.js");
const VehicleserviceRequests = require("./routes/vehicles/vServiceRequest.js");
const GarageReceive = require("./routes/vehicles/garageReceive.js");
const DeptRoutes = require("./routes/vehicles/deptRoutes.js");
const Jobcard = require("./routes/vehicles/jobCardRoutes.js");
const PartsUsed = require("./routes/vehicles/partRequests.js");
const VdisporsalRoutes = require("./routes/vehicles/vDisposalRoutes.js");

// Job card Routes
const joCardRoutes = require("./routes/jobcard/jobCardRoutes.js");
const joCardSpareRoutes = require("./routes/JobCardSpare/JobCardSpare.js");

// Stores Routes
const storesRoutes = require("./routes/stores/index.js");

// System Routes
const systemRoutes = require("./routes/system/systemRoutes.js");

const app = express();
dotenv.config();

// Trust proxy (required when behind reverse proxy like Nginx)
// Only enable in production or when explicitly set via environment variable
// For local development without Nginx, set to false to avoid rate limiter warnings
const enableTrustProxy = process.env.ENABLE_TRUST_PROXY === 'true' || 
                         (process.env.NODE_ENV === 'production' && process.env.BEHIND_PROXY === 'true');
app.set('trust proxy', enableTrustProxy);

// Configure CORS to allow network access
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(requestLogger);
app.use(validateInput);
app.use(generalLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/**************** ICT Routes ********************/
app.use("/api/users", authLimiter, userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/model", modelRoutes);
app.use("/api/type", typeRoutes);
app.use("/api/issue", ictIssue);
app.use("/api/assets", assetRoutes);
app.use("/api/department", deptRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/uploads", uploadLimiter, uploadRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/dispatch", dispatchRoutes);
app.use("/api/maintenance", maintenance);
app.use("/api/disposal", disposalRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/requisition", requisitionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/servers", serverRoutes);

/**************** Vehicles Routes ********************/
app.use("/api/vehicles", vehicleRoutes);  // Primary vehicles endpoint
app.use("/api/v/vehicle", vehicleRoutes);  // Legacy vehicles endpoint
app.use("/api/v/type", VehicleType);
app.use("/api/depts", DeptRoutes);
app.use("/api/v/make", VehicleMake);
app.use("/api/v/garage", VehicleGarage);
app.use("/api/v/driver", VehicleDriver);
app.use("/api/v/sparecategory", SpareCategory);
app.use("/api/v/sparepart", vehicleSpareParts);
app.use("/api/v/sparepartQty", vehicleSparePartsQty);
app.use("/api/v/service", VehicleserviceRequests);
app.use("/api/v/receive", GarageReceive);
app.use("/api/v/jobcard", Jobcard);
app.use("/api/v/parts", PartsUsed);
// Temporarily disable problematic vehicle routes until database is properly set up
// app.use("/api/v/disposal", VdisporsalRoutes);

/**************** job card Routes ********************/
app.use("/api/jobcards", joCardRoutes);
app.use("/api/jobcard/spare", joCardSpareRoutes);

/**************** Stores Routes ********************/
app.use("/api/stores", storesRoutes);

/**************** System Routes ********************/
app.use("/api/system", systemRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server started successfully on port ${PORT} in ${process.env.NODE_ENV || 'development'}`);
  
  try {
    await connectDB();
    // Temporarily disable auto-sync to allow server to start
    // Run migrations manually instead: npm run migrate
    console.log("✅ Server running - database sync disabled");
  } catch (error) {
    console.log("⚠️ Database connection warning:", error.message);
    console.log("✅ Server is running - configure PostgreSQL database");
  }
});
