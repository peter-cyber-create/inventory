module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: './backend/index.js',
      cwd: '/opt/moh-uganda-ims',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/moh-ims-backend-error.log',
      out_file: '/var/log/moh-ims-backend-out.log',
      log_file: '/var/log/moh-ims-backend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'moh-ims-frontend',
      script: 'serve',
      args: '-s build -l 3000',
      cwd: '/opt/moh-uganda-ims/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/moh-ims-frontend-error.log',
      out_file: '/var/log/moh-ims-frontend-out.log',
      log_file: '/var/log/moh-ims-frontend.log',
      time: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
