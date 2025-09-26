const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Adjust if your frontend runs on a different port
    supportFile: false,
  },
});



