const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STREAM_PASSWORD = 'meinradio123';

// Statische Dateien aus dem public-Ordner ausliefern
app.use(express.static(path.join(__dirname, 'public')));

let clients = [];

// butt sendet hier den Stream hin (POST)
app.post('/stream', (req, res) => {
  const auth = req.headers['authorization'];
  const expected = 'Basic ' + Buffer.from('source:' + STREAM_PASSWORD).toString('base64');
  if (!auth || auth !== expected) {
    res.set('WWW-Authenticate', 'Basic realm="Stream"');
    res.status(401).send('Unauthorized');
    return;
  }
  req.on('data', chunk => {
    clients.forEach(client => client.write(chunk));
  });
  req.on('end', () => {
    res.end();
  });
  res.status(200).end();
});

// Website holt hier den Stream ab (GET)
app.get('/radio', (req, res) => {
  res.set({
    'Content-Type': 'audio/mpeg',
    'Transfer-Encoding': 'chunked'
  });
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
}); 