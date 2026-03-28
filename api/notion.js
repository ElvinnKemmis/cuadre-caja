export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Notion-Version');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const path = req.url.replace('/api/notion', '');

    const notionRes = await fetch('https://api.notion.com/v1' + path, {
      method: req.method,
      headers: {
        'Authorization': req.headers['authorization'] || '',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: (req.method !== 'GET' && req.method !== 'DELETE')
        ? JSON.stringify(req.body)
        : undefined
    });

    const text = await notionRes.text();
    
    res.status(notionRes.status).send(text);

  } catch (error) {
    res.status(500).json({
      error: 'Proxy error',
      details: error.message
    });
  }
}