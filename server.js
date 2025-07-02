const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SHOUTCAST_URL = 'http://stream.laut.fm/80s80s'; // Beispiel-Stream

// Statische Dateien aus dem public-Ordner ausliefern
app.use(express.static(path.join(__dirname, 'public')));

// Proxy-Endpunkt für den Radio-Stream
app.get('/radio', (req, res) => {
  http.get(SHOUTCAST_URL, (streamRes) => {
    res.setHeader('Content-Type', streamRes.headers['content-type'] || 'audio/mpeg');
    streamRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Stream-Fehler');
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
}); 