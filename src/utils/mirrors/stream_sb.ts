import * as puppeteer from 'puppeteer-core';

export interface SSB {
   link: string;
   get(quality: StreamQuality): Promise<any>;
}

export type StreamQuality = 0 | 1;

export default class StreamSB implements SSB {
   link: string;

   constructor(link: string) {
      this.link = link;
   }

   async get(quality: StreamQuality): Promise<any> {
      try {
         const browser = await puppeteer.launch();
         const page = await browser.newPage();
         await page.goto(this.link);
         const High = await page.waitForSelector('aria/High quality');
         const Low = await page.waitForSelector('aria/Normal quality');
         if (quality === 1) {
            await High.click();
            const isErr = await page.waitForSelector('.err');
            let Link_01: any;
            if (isErr) {
               const tempLink = await page.waitForSelector(
                  'aria/Download Video'
               );
               await tempLink.click();
            }
            Link_01 = await page.waitForSelector('aria/Direct Download Link');
            await Link_01.click();
         } else {
            await Low.click()
            const isErr = await page.waitForSelector('.err', {
               hidden: true,
            });
            let Link_01: any;
            if (isErr) {
               const tempLink = await page.waitForSelector(
                  'aria/Download Video'
               );
               await tempLink.click();
            }
            Link_01 = await page.waitForSelector('aria/Direct Download Link');
            await Link_01.click();
         }
         const DL_link = await page.waitForSelector(
            'aria/Direct Download Link'
         );
         const href = await DL_link.getProperty('href');
         const hrefString = await href.jsonValue();
         console.log(hrefString);
         return hrefString;
      } catch (e) {
         console.error(e.message);
      }
   }
}
