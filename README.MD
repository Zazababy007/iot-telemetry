# IoT Telemetry Dashboard

A small end-to-end IoT pipeline: a device posts sensor readings to an authenticated
REST API, which stores them in SQLite and serves a live dashboard.

## Architecture
Device → Express API → SQLite → Dashboard

## Features
- API-key authentication for devices
- Input validation and parameterized SQL queries
- Live dashboard with dual-axis chart and offline warning
- Simulated device for development without hardware

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set a key
3. `node --env-file=.env index.js`
4. In a second terminal: `node --env-file=.env device.js`
5. Open http://localhost:3000

## API
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /readings | x-api-key | Store a reading |
| GET | /readings | none | Latest 100 readings |
| GET | /health | none | Health check |

)