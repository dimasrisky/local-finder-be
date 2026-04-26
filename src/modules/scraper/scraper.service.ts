import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { ResponseStartScraping } from './dto/response-start-scraping.dto';
import { LocationItem } from '../location-item/entities/location-item.entity';
import { DataSource } from 'typeorm';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly datasource: DataSource,
  ) {}

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

    return browser;
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
    const savedResultScraping: LocationItem[] = [];

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const page = await browser.newPage();

      const location = queryRunner.manager.create(Location, {
        name: startScrapingDto.name,
        searchQuery: startScrapingDto.search,
        totalItems: 0,
      });
      const savedLocation = await queryRunner.manager.save(Location, location);
      console.log(savedLocation);

      this.logger.debug('Getting list locations...');
      await page.goto(
        `https://www.google.com/maps/search/${startScrapingDto.search}`,
        {
          waitUntil: 'networkidle2',
          timeout: 30000,
        },
      );
      await this.autoScroll(page, startScrapingDto.maxScroll);
      this.logger.debug('Successfully getting list locations');

      // Ambil list lokasi
      const html = await page.content();
      const $ = cheerio.load(html);

      const items = $('div[role=article] > a')
        .map((i, element) => {
          const $location = $(element);
          this.logger.debug(`Getting Location: ${$location.attr('href')}`);
          return $location.attr('href');
        })
        .get();

      this.logger.debug(`Successfully getting ${items.length} locations`);

      for (const item of items) {
        try {
          this.logger.debug('Getting location detail...');
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

          this.logger.debug(`Successfully getting location detail: ${title}`);

          const _createLocationItem = {
            title,
            rating,
            address,
            phoneNumber,
            url,
            googleMapsUrl: item,
            location: savedLocation,
          };

          const savedLocationItem = queryRunner.manager.create(
            LocationItem,
            _createLocationItem,
          );
          savedResultScraping.push(savedLocationItem);
        } catch (error) {
          this.logger.error(error);
          continue;
        }
      }

      const result = await queryRunner.manager.save(
        LocationItem,
        savedResultScraping,
      );

      savedLocation.totalItems = result.length;
      await queryRunner.manager.save(Location, savedLocation);

      await queryRunner.commitTransaction();

      this.logger.debug('Successfully scraped all locations');

      return result;
    } catch (error) {
      this.logger.error('Scraping failed', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
      await queryRunner.release();
    }
  }
}
