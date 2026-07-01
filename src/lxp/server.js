const express = require('express');
const path = require('path');
const http = require('http');
const compression = require('compression');
const { startListener } = require('./pgNotifyListener');

const app = express();

// ────────────────────────────────────────────────
// Compression – should be first (or very early)
const runningInAzureAppService = process.env.WEBSITE_SITE_NAME !== undefined;

const compressionOptions = {
  level: parseInt(process.env.HTTP_RESPONSE_COMPRESSION_LEVEL) || 6,
  threshold: parseInt(process.env.HTTP_RESPONSE_COMPRESSION_THRESHOLD) || 1024,
  // filter: only compress if client supports it + no explicit bypass
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    // compression.filter is the default accept-encoding check
    return compression.filter(req, res);
  },
  encodings: ['br', 'gzip', 'deflate'], // order = preference
};

console.log("Compression settings → level:", compressionOptions.level, "threshold:", compressionOptions.threshold);

app.use(compression(compressionOptions));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// ────────────────────────────────────────────────
// Serve static files
const buildPath = runningInAzureAppService ? __dirname : path.join(__dirname, 'build');

app.use(express.static(buildPath));

// Single-page app fallback (React Router)
const indexHtmlFile = runningInAzureAppService
  ? path.join(__dirname, 'index.html')
  : path.join(__dirname, 'build', 'index.html');

console.log("Index file:", indexHtmlFile);

app.get('*', (req, res) => {
  res.sendFile(indexHtmlFile, err => {
    if (err) {
      console.error('SendFile error:', err);
      res.status(500).send('Server error');
    }
  });
});

// ────────────────────────────────────────────────
const MAX_HEADER_SIZE = parseInt(process.env.MAX_HEADER_SIZE) || 80000;

console.log("Setting maxHeaderSize:", MAX_HEADER_SIZE);

const server = http.createServer({ maxHeaderSize: MAX_HEADER_SIZE }, app);

const port = process.env.PORT || 3000;
console.log(runningInAzureAppService ? "Running in Azure App Service" : "Running locally");
console.log("Starting server on port:", port);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  if (process.env.ENABLE_ERROR_NOTIFICATIONS === 'true') {
    startListener();
  } else {
    console.log('pg-notify: disabled (not production)');
  }
});