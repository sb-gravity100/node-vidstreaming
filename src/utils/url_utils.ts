import loading from './loading';
import * as fs from 'fs';
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
   const instance = new Vidstreaming(res, options)
   const stream = fs.createWriteStream(output);
   loading.start()

   instance.on('error', err => {
      console.log(err.message);
      process.exit(1)
   })
   instance.on('loaded', (urls, total) => {
      process.stdout.clearLine()
      process.stdout.cursorTo(0);
      loading.message(`${urls.length} / ${total}`)
   })

   await instance.episodes(anime.link)
   await instance.writeTo(output)
}
