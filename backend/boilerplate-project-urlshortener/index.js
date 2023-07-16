require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL shortener functionality
const urlDatabase = {};
let currentShortId = 1;

app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;

  // Validate the URL format
  if (!isValidUrl(url)) {
    res.json({ error: 'invalid url' });
    return;
  }

  // Check if the URL is reachable
  dns.lookup(getHostname(url), (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      // Store the URL in the database and return the short URL
      const shortUrl = currentShortId;
      urlDatabase[currentShortId] = url;
      currentShortId++;
      res.json({ original_url: url, short_url: shortUrl });
    }
  });
});

// Redirect to the original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid short url' });
  }
});

// Helper function to validate URL format
function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// Helper function to get the hostname from a URL
function getHostname(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    return null;
  }
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
