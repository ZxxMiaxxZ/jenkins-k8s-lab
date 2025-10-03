const express = require('express');
const os = require('os');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>K8s + Jenkins Lab</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin: 0; }
        .info {
          margin-top: 20px;
          font-size: 1.2em;
        }
        .badge {
          background: #4CAF50;
          padding: 5px 15px;
          border-radius: 20px;
          display: inline-block;
          margin: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Jenkins + K8s Lab</h1>
        <div class="info">
          <div class="badge">Build: ${process.env.BUILD_NUMBER || 'local'}</div>
          <div class="badge">Pod: ${os.hostname()}</div>
          <div class="badge">Version: ${process.env.VERSION || '1.0'}</div>
        </div>
        <p style="margin-top: 30px;">✅ Deployed successfully via Jenkins CI/CD!</p>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    pod: os.hostname(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Pod: ${os.hostname()}`);
});
