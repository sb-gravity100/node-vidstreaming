import clipboard from 'clipboardy';
import chalk from 'chalk';
import fs from 'fs';
import ProgressBar from 'progress';
import loading from './loading';
import Vidstreaming, { SearchData, FilterOptions } from '../vidstreaming';

export async function searchUrls(
   search: string
): Promise<Array<SearchData> | undefined> {
   const vid = new Vidstreaming();
   vid.on('error', err => {
      switch (err.code) {
         case 'ANINOTFOUND':
            console.error(err.message);
            break;
         case 'ENOTFOUND':
            console.log(
               'Something went wrong. Check your internet connection.'
            );
            break;
         default:
            console.log(err.message);
      }
      process.exit(1);
   });
   return await vid.term(search);
}

export async function writeUrls(
   anime: SearchData,
   output: string,
   res?: string,
   options?: FilterOptions
): Promise<void> {
   const instance = new Vidstreaming(res, options);
   loading.start();

   instance.on('error', err => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(err.message);
      fs.unlink(output, e => {
         if (e) {
            console.log(e.message);
         }
      });
      process.exit(1);
   });
   instance.on('loaded', (urls, total) => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      loading.message(`Getting urls... ${urls.length} / ${total}`);
   });
   instance.on('write', () => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      loading.message('Writing to file...');
   });

   const data = await instance.episodes(anime.link);
   await instance.writeTo(output, data);
   loading.stop();
   console.log(chalk.greenBright('  URLS written successfully'));
}

export async function clipboardUrls(
   anime: SearchData,
   res?: string,
   options?: FilterOptions
): Promise<void> {
   const instance = new Vidstreaming(res, options);
   loading.start();

   instance.on('error', err => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(err.message);
      process.exit(1);
   });
   instance.on('loaded', (urls, total) => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      loading.message(`Getting urls... ${urls.length} / ${total} Episodes`);
   });
   const data = await instance.episodes(anime.link);
   const data_string = data ? data.map(d => d.src).join('\n') : '';
   await clipboard.write(data_string);
   loading.stop();
   process.stdout.write(chalk.greenBright('  Copied urls to clipboard'));
}

export async function downloadUrls(
   anime: SearchData,
   output: string,
   res?: string,
   options?: FilterOptions
): Promise<void> {
   const instance = new Vidstreaming(res, options);
   loading.start()
   let bar: any;

   instance.on('error', err => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(err.message);
      process.exit(1);
   });
   instance.on('queue', (i, f, l) => {
      loading.stop()
      const len = parseInt(l.length);
      bar = new ProgressBar(`DL - [:bar] ${i.cur}/${i.total} :percent :size/${l.human}`, {
         width: 30,
         complete: '#',
         incomplete: ' ',
         total: len,
      });
   });
   instance.on('loaded', (urls, total) => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      loading.message(`Getting urls... ${urls.length} / ${total} Episodes`);
   });
   instance.on('download', (chunk, _data, _filename) => {
      // process.stdout.clearLine();
      const size = require('pretty-bytes')(Number(_data), {
         maximumFractionDigits: 2
      })
      bar.tick(chunk.length, {
         'size': size
      })
   });
   instance.on('done', () => {
      process.stdout.clearLine(0);
      console.log('Downloads done~ Exiting...');
      process.exit(0)
   })

   const data = await instance.episodes(anime.link);
   await instance.download(output, data);
}
