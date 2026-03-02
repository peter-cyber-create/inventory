require('fs').writeFileSync(
  require('path').join(__dirname, 'dist', 'build-time.txt'),
  new Date().toISOString()
);
