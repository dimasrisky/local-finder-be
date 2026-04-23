const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set user agent agar tidak dianggap bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto('https://www.google.com/maps/search/coffeeshop', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Tunggu elemen muncul
    await page.waitForSelector('div[role="article"]', { timeout: 10000 });

    console.log('=== INSPECT HTML STRUCTURE ===\n');

    // Ambil struktur div[role=article] pertama
    const firstArticleHtml = await page.evaluate(() => {
      const article = document.querySelector('div[role="article"]');
      if (!article) return 'Tidak ditemukan div[role="article"]';

      // Ambil outerHTML terbatas
      let html = article.outerHTML;
      if (html.length > 3000) html = html.substring(0, 3000);
      return html;
    });
    console.log('1. Struktur HTML div[role="article"] pertama:');
    console.log(firstArticleHtml);
    console.log('\n' + '='.repeat(60) + '\n');

    // Cek selector link di dalam article
    console.log('2. Cek selector a href di dalam div[role="article"]:');
    const linkInfo = await page.evaluate(() => {
      const articles = document.querySelectorAll('div[role="article"]');
      const results = [];

      articles.forEach((article, idx) => {
        if (idx >= 5) return; // Ambil 5 pertama saja

        // Cari link di berbagai cara
        const directLink = article.querySelector('a');
        const allLinks = article.querySelectorAll('a');

        results.push({
          index: idx,
          hasDirectLink: !!directLink,
          directLinkHref: directLink?.getAttribute('href')?.substring(0, 100),
          totalLinks: allLinks.length,
          linkHrefs: Array.from(allLinks).map(a => ({
            href: a.getAttribute('href')?.substring(0, 80),
            class: a.getAttribute('class'),
            ariaLabel: a.getAttribute('aria-label')
          }))
        });
      });

      return results;
    });
    console.log(JSON.stringify(linkInfo, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // Cek apakah href mengandung /maps/place/
    console.log('3. Filter hanya link dengan /maps/place/ atau /maps/preview:');
    const placeLinks = await page.evaluate(() => {
      const articles = document.querySelectorAll('div[role="article"]');
      const results = [];

      articles.forEach((article, idx) => {
        if (idx >= 10) return;

        const allLinks = article.querySelectorAll('a');
        allLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href.includes('/maps/place/') || href.includes('/maps/preview') || href.includes('!1s'))) {
            results.push({
              index: idx,
              href: href.substring(0, 150),
              text: link.textContent?.substring(0, 50)
            });
          }
        });
      });

      return results;
    });
    console.log(JSON.stringify(placeLinks, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
