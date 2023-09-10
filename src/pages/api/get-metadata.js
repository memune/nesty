import axios from 'axios';
import cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
const TIMEOUT = 5000;

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT
      },
      timeout: TIMEOUT
    });
    const metadata = extractMetadata(response.data);

    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout. Please try again.' });
    } else if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Page not found.' });
    } else {
      res.status(500).json({ error: 'An error occurred while fetching metadata.' });
    }
  }
}

function extractMetadata(html) {
  const $ = cheerio.load(html);

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
  const author = $('meta[name="author"]').attr('content');

  // 본문 추출 코드 추가
  const bodyContent = extractArticleBody(html);

  return { title, description, image, author, bodyContent };
}

function extractArticleBody(html) {
  const $ = cheerio.load(html);
  const threshold = 200; // 임계값 설정
  let articleBody = "";

  $('p, article, section').each((index, element) => {
    const textBlock = $(element).text().trim();
    
    // 텍스트 블록 필터링
    if (textBlock.includes("광고") || textBlock.includes("댓글") || textBlock.includes("Copyright") || textBlock.includes(".css")) {
      return; // 현재 텍스트 블록을 건너뜁니다.
    }

    if (textBlock.length > threshold) {
      articleBody += textBlock + "\n\n"; // 본문에 추가
    }
  });

  return articleBody;
}
