const path = require('path');
const fs = require('fs');

// Load environment variables from production.env if it exists
const productionEnvPath = path.join(__dirname, 'production.env');
if (fs.existsSync(productionEnvPath)) {
  const envContent = fs.readFileSync(productionEnvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Load backend.env for database configuration
const backendEnvPath = path.join(__dirname, 'config', 'environments', 'backend.env');
if (fs.existsSync(backendEnvPath)) {
  const envContent = fs.readFileSync(backendEnvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const resolvePath = (targetPath) => path.resolve(targetPath);
const APP_DIR = resolvePath(process.env.APP_DIR || __dirname);
const LOGS_DIR = resolvePath(process.env.LOG_DIR || path.join(APP_DIR, 'logs'));
const BACKEND_PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const SERVE_ARGS = ['serve', '-s', 'build', '-l', FRONTEND_PORT, '--single'].join(' ');

module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: 'npx',
      args: 'babel-node index.js',
      cwd: path.join(APP_DIR, 'backend'),
      instances: process.env.BACKEND_INSTANCES || 1,
      exec_mode: process.env.BACKEND_EXEC_MODE || 'fork',
      env: {
        NODE_ENV,
        PORT: BACKEND_PORT,
        // Pass through database and security env vars
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        SECRETKEY: process.env.SECRETKEY,
        JWT_SECRET: process.env.JWT_SECRET,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        FRONTEND_URL: process.env.FRONTEND_URL
      },
      error_file: path.join(LOGS_DIR, 'backend-error.log'),
      out_file: path.join(LOGS_DIR, 'backend-out.log'),
      log_file: path.join(LOGS_DIR, 'backend.log'),
      time: true,
      max_memory_restart: process.env.BACKEND_MAX_MEMORY || '1G',
      node_args: process.env.BACKEND_NODE_ARGS || '--max-old-space-size=1024',
      restart_delay: parseInt(process.env.BACKEND_RESTART_DELAY || '4000', 10),
      max_restarts: parseInt(process.env.BACKEND_MAX_RESTARTS || '10', 10),
      min_uptime: process.env.BACKEND_MIN_UPTIME || '10s'
    },
    {
      name: 'moh-ims-frontend',
      script: 'npx',
      args: SERVE_ARGS,
      cwd: path.join(APP_DIR, 'frontend'),
      instances: parseInt(process.env.FRONTEND_INSTANCES || '1', 10),
      env: {
        NODE_ENV,
        PORT: FRONTEND_PORT
      },
      error_file: path.join(LOGS_DIR, 'frontend-error.log'),
      out_file: path.join(LOGS_DIR, 'frontend-out.log'),
      log_file: path.join(LOGS_DIR, 'frontend.log'),
      time: true,
      restart_delay: parseInt(process.env.FRONTEND_RESTART_DELAY || '4000', 10),
      max_restarts: parseInt(process.env.FRONTEND_MAX_RESTARTS || '10', 10),
      min_uptime: process.env.FRONTEND_MIN_UPTIME || '10s'
    }
  ]
};
