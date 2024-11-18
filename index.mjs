import dotenv from 'dotenv';
dotenv.config();
import  express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// In-memory storage for URLs
const urlDatabase = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
//app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.static('public'));

// Homepage
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Shorten URL Endpoint (POST)
// Handle URL shortening
app.post('/api/shorturl', (req, res) => {
  const { original_url, custom_alias } = req.body;

  // Validate URL format using a regex pattern
  const urlPattern = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}(\/[a-zA-Z0-9#?&%=]*)?$/
  if (!urlPattern.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if a custom alias is provided, and ensure it's not already used
  let shortUrl;
  if (custom_alias) {
    if (urlDatabase.has(custom_alias)) {
      return res.json({ error: 'Custom alias already in use' });
    }
    shortUrl = custom_alias;  // use custom alias
  } else {
    shortUrl = nanoid(6);  // generate a 6-character short URL
  }

  // Store the original URL and short URL mapping in the in-memory database
  urlDatabase.set(shortUrl, { original_url, clicks: 0 });

  // Respond with original URL and short URL
  res.json({ original_url, short_url: shortUrl });
});

// Redirect to original URL when accessing short URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;

  // Retrieve the original URL from the in-memory database
  const urlData = urlDatabase.get(shortUrl);

  if (urlData) {
    // Update click count
    urlData.clicks += 1;

    // Redirect to the original URL
    return res.redirect(urlData.original_url);
  } else {
    return res.json({ error: 'Short URL not found' });
  }
});

// Generate QR Code for Short URL (GET /api/shorturl/:short_url/qrcode)
app.get('/api/shorturl/:short_url/qrcode', async (req, res) => {
  const shortUrl = req.params.short_url;

  const urlData = urlDatabase.get(shortUrl);

  if (!urlData) {
    return res.json({ error: 'Short URL not found' });
  }

  try {
    const qrcode = await QRCode.toDataURL(urlData.original_url);
    res.json({ qrcode });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Listen on Port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
