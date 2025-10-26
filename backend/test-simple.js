const express = require('express');
const { connectDB, sequelize } = require('./config/db.js');

console.log('✅ Basic imports working');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  try {
    await connectDB();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('⚠️ Database connection failed:', error.message);
  }
});
