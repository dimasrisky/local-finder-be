const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // URL contoh dari hasil scraping sebelumnya
    const sampleUrl = 'https://www.google.com/maps/place/Kedai+Double+R/data=!4m7!3m6!1s0x2e78834675b349fb:0xe4b2733bbc09b8b7!8m2!3d-7.9874369!4d112.6145283!16s%2Fg%2F11h31w_mnk!19sChIJ-0mzdUaDeC4Rt7gJvDtzsuQ?authuser=0&hl=id&rclk=1';

    console.log('Mengakses URL:', sampleUrl.substring(0, 80) + '...\n');

    await page.goto(sampleUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Tunggu beberapa elemen penting
    await new Promise(r => setTimeout(r, 3000));

    console.log('=== INSPECT HALAMAN DETAIL ===\n');

    // 1. Cari title
    console.log('1. Mencari TITLE (h1, h2, dll):');
    const titleInfo = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');

      return {
        h1Count: h1s.length,
        h1Texts: Array.from(h1s).map(h => ({
          text: h.textContent?.substring(0, 50),
          class: h.className,
          id: h.id
        })),
        h2Count: h2s.length,
        h2Texts: Array.from(h2s).map(h => ({
          text: h.textContent?.substring(0, 50),
          class: h.className
        })).slice(0, 5)
      };
    });
    console.log(JSON.stringify(titleInfo, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // 2. Cari rating (bintang)
    console.log('2. Mencari RATING (span dengan aria-label bintang):');
    const ratingInfo = await page.evaluate(() => {
      const starElements = document.querySelectorAll('[aria-label*="bintang"], [aria-label*="star"]');
      const spansWithNumbers = document.querySelectorAll('span');

      let ratingText = '';
      for (let span of spansWithNumbers) {
        const text = span.textContent?.trim();
        if (text && /^\d+[,.]\d+/.test(text) && text.length < 10) {
          ratingText = text;
          break;
        }
      }

      return {
        starCount: starElements.length,
        starLabels: Array.from(starElements).map(s => ({
          ariaLabel: s.getAttribute('aria-label'),
          textContent: s.textContent?.substring(0, 30)
        })),
        foundRating: ratingText
      };
    });
    console.log(JSON.stringify(ratingInfo, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // 3. Cari address
    console.log('3. Mencari ADDRESS (button dengan data-item-id address):');
    const addressInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const addressButtons = [];

      buttons.forEach(btn => {
        const dataItemId = btn.getAttribute('data-item-id');
        const ariaLabel = btn.getAttribute('aria-label');
        const text = btn.textContent?.trim();

        if (dataItemId?.includes('address') ||
            ariaLabel?.toLowerCase().includes('alamat') ||
            (text && text.includes('Jl.') && text.length < 100)) {
          addressButtons.push({
            dataItemId,
            ariaLabel,
            text: text?.substring(0, 80)
          });
        }
      });

      return {
        totalButtons: buttons.length,
        addressButtons
      };
    });
    console.log(JSON.stringify(addressInfo, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // 4. Cari phone number
    console.log('4. Mencari PHONE NUMBER:');
    const phoneInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const phoneButtons = [];

      buttons.forEach(btn => {
        const dataItemId = btn.getAttribute('data-item-id');
        const ariaLabel = btn.getAttribute('aria-label');
        const text = btn.textContent?.trim();

        if (dataItemId?.includes('phone') ||
            dataItemId?.includes('tel') ||
            ariaLabel?.toLowerCase().includes('telepon') ||
            ariaLabel?.toLowerCase().includes('phone')) {
          phoneButtons.push({
            dataItemId,
            ariaLabel,
            text: text?.substring(0, 50)
          });
        }
      });

      // Cari elemen dengan icon telepon
      const allSpans = document.querySelectorAll('span');
      const phoneSpans = [];
      allSpans.forEach(span => {
        const text = span.textContent?.trim();
        if (text && /^\+?\d[\d\s\-\(\)]{7,}/.test(text) && text.length < 30) {
          phoneSpans.push({
            text,
            class: span.className
          });
        }
      });

      return {
        phoneButtons,
        phoneSpans: phoneSpans.slice(0, 5)
      };
    });
    console.log(JSON.stringify(phoneInfo, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // 5. Test selector yang lebih robust
    console.log('5. TEST SELECTOR YANG LEBIH ROBUST:');
    const robustData = await page.evaluate(() => {
      const result = {
        title: '',
        rating: '',
        address: '',
        phone: ''
      };

      // Title - cari h1
      const h1 = document.querySelector('h1');
      if (h1) result.title = h1.textContent?.trim() || '';

      // Rating - cari span dengan pattern angka desimal
      const spans = document.querySelectorAll('span');
      for (let span of spans) {
        const text = span.textContent?.trim();
        if (text && /^\d+[,.]\d+/.test(text) && text.length < 10) {
          result.rating = text;
          break;
        }
      }

      // Address - cari button dengan data-item-id yang mengandung 'address'
      const buttons = document.querySelectorAll('button[data-item-id]');
      for (let btn of buttons) {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId && (itemId.includes('address') || itemId.includes('cis'))) {
          const textDiv = btn.querySelector('div[class*="Io6YTe"]');
          if (textDiv) {
            result.address = textDiv.textContent?.trim() || '';
            break;
          }
        }
      }

      // Phone - cari button dengan data-item-id yang mengandung 'phone'
      for (let btn of buttons) {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId && (itemId.includes('phone') || itemId.includes('xd'))) {
          const textDiv = btn.querySelector('div[class*="Io6YTe"]');
          if (textDiv) {
            result.phone = textDiv.textContent?.trim() || '';
            break;
          }
        }
      }

      return result;
    });
    console.log(JSON.stringify(robustData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
