import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { IResultScraping } from './interfaces/result-scraping.interface';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { ResponseStartScraping } from './dto/response-start-scraping.dto';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(private readonly configService: ConfigService) {}

  async initiateBrowser() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        this.configService.get('CHROME_PATH') ||
        (process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : '/usr/bin/google-chrome'),
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled', // agar tidak terdeteksi bot
      ],
    });

    return browser
  }

  async autoScroll(page: Page, maxScrolls: number = 5): Promise<void> {
    await page.evaluate(async (count) => {
      const scrollContainer = document.querySelector(
        'div[role="feed"]',
      ) as HTMLElement;
      if (!scrollContainer) {
        return;
      }

      for (let i = 0; i < count; i++) {
        scrollContainer.scrollTop += 300;
        // Tunggu 1 detik untuk konten baru dimuat
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }, maxScrolls);
  }

  async startScraping(
    startScrapingDto: StartScrapingDto,
  ): Promise<ResponseStartScraping[]> {
    const browser: Browser = await this.initiateBrowser();
    if (!browser) throw new InternalServerErrorException();
    const results: IResultScraping[] = [];
    try {
      const page = await browser.newPage();

      await page.goto(
        `https://www.google.com/maps/search/${startScrapingDto.search}`,
        {
          waitUntil: 'networkidle2',
          timeout: 30000,
        },
      );
      await this.autoScroll(page, startScrapingDto.maxScroll);

      // Ambil list lokasi
      const html = await page.content();
      const $ = cheerio.load(html);

      const items = $('div[role=article] > a')
        .map((i, element) => {
          const $location = $(element);
          return $location.attr('href');
        })
        .get();

      console.log(items);

      for (const item of items) {
        await page.goto(item, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });

        const html = await page.content();
        const $$ = cheerio.load(html);

        // Title - cari h1
        const title = $$('h1').first().text().trim();

        // Rating - cari dari aria-label yang mengandung "bintang"
        let rating = '';
        $$('[aria-label*="bintang"]').each((i, el) => {
          const label = $$(el).attr('aria-label') || '-';
          const match = label.match(/([\d,]+\.?\d*)\s*bintang/);
          if (match && !rating) {
            rating = match[1].replace(',', '.');
          }
        });

        // Address - dari button dengan data-item-id="address"
        const addressBtn = $$('button[data-item-id="address"]');
        const address =
          addressBtn.attr('aria-label')?.replace('Alamat: ', '') || '-';

        // Phone - dari button dengan data-item-id yang mengandung "phone"
        const phoneBtn = $$('button[data-item-id*="phone"]');
        const phoneNumber =
          phoneBtn
            .attr('aria-label')
            ?.replace('Telepon: ', '')
            .replace(/\s/g, '') || '-';

        // Url
        const urlAnchor = $$('a[data-item-id="authority"]');
        const url = urlAnchor.attr('href') || '-';

        results.push({ title, rating, address, phoneNumber, url, googleMapsUrl: item });
      }

      return results;
    } catch (error) {
      this.logger.error('Scraping failed', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
