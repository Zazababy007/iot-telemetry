const express = require('express');
const app = express();

const Database = require('better-sqlite3');
const db = new Database('telemetry.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const insertReading = db.prepare(
  'INSERT INTO readings (device_id, temperature, humidity, created_at) VALUES (?, ?, ?, ?)'
);
const selectReadings = db.prepare(
  'SELECT * FROM readings ORDER BY id DESC LIMIT 100'
);

function requireDeviceKey(req, res, next) {
  const key = req.get('x-api-key');
  if (!key || key !== process.env.DEVICE_API_KEY) {
    return res.status(401).json({ error: 'invalid or missing API key' });
  }
  next();
}

app.post('/readings', requireDeviceKey, (req, res) => {
  const { deviceId, temperature, humidity } = req.body;

  if (!deviceId || typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).json({ error: 'deviceId, temperature and humidity are required' });
  }

  const timestamp = new Date().toISOString();
  insertReading.run(deviceId, temperature, humidity, timestamp);

  res.status(201).json({ deviceId, temperature, humidity, timestamp });
});

app.get('/readings', (req, res) => {
  res.json(selectReadings.all());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});