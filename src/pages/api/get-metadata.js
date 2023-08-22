import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const metadata = extractMetadata(response.data);

    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching metadata.' });
  }
}

function extractMetadata(html) {
  const $ = cheerio.load(html);

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');

  return { title, description, image };
}
