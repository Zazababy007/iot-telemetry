const API_URL = 'http://localhost:3000/readings';
const API_KEY = process.env.DEVICE_API_KEY;
const DEVICE_ID = 'sim-device-1';

let temperature = 27;
let humidity = 60;

function nextReading() {
  temperature += (Math.random() - 0.5) * 0.6;
  humidity += (Math.random() - 0.5) * 2;
  humidity = Math.min(100, Math.max(0, humidity));

  return {
    deviceId: DEVICE_ID,
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
  };
}

async function send() {
  const reading = nextReading();
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(reading),
    });
    console.log(res.status, JSON.stringify(reading));
  } catch (err) {
    console.error('Send failed:', err.message);
  }
}

send();
setInterval(send, 5000);