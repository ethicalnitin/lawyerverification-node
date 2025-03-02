const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cheerio = require('cheerio');

const router = express.Router();

router.post('/', async (req, res) => {
  const { registrationNumber } = req.body;

  if (!registrationNumber) {
    return res.status(400).json({ error: 'Registration number is required' });
  }

  try {
    // 1. Build the form data as URL-encoded
    const payload = querystring.stringify({
      'Enroll_Id': registrationNumber,
      'search-verification': 'Search',
    });

    // 2. Define headers (from your curl command)
    const headers = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.7",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "origin": "https://delhibarcouncil.com",
      "priority": "u=0, i",
      "referer": "https://delhibarcouncil.com/bcd/verification_individual.php",
      "sec-ch-ua": `"Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
    };

    // 3. Make the POST request
    const response = await axios.post(
      'https://delhibarcouncil.com/bcd/verification_individual.php',
      payload,
      { headers }
    );

    // 4. Parse the returned HTML with Cheerio
    const $ = cheerio.load(response.data);


    const results = [];
    $('table.table.table-bordered tbody tr').each((index, row) => {
      const tds = $(row).find('td');
      if (tds.length >= 5) {
        results.push({
          slNo: $(tds[0]).text().trim(),
          enrollmentNo: $(tds[1]).text().trim(),
          name: $(tds[2]).text().trim(),
          verificationStatus: $(tds[3]).text().trim(),
          remark: $(tds[4]).text().trim(),
        });
      }
    });

    
    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
