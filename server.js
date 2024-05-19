import express from 'express';
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');  // Tambahkan ini

const app = express();

app.use(cors());  // Tambahkan ini

app.get('/api/article', async (req, res) => {
  const { url } = req.query;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    const date = $('meta[property="article:published_time"]').attr('content') || new Date().toISOString();

    res.json({ title, description, image, date, link: url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
