import _ from 'lodash';
import async from 'async';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

const url = 'https://gogo-stream.com';
const instance = axios.create({
   baseURL: url,
   headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axiosRetry(instance, { retries: 5 });

export class Vidstreaming extends EventEmitter {
   constructor(search, res, filter) {
      super({ captureRejections: true });
      this.search = search;
      this.res = res;
      this.filter = filter;
      this.data = _.chain([]);
      this.episodes();
   }

   async episodes() {
      try {
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: this.search,
            },
         });
         if (anime.data.content === '' || !anime.data.content) {
            process.stdout.clearLine();
            process.stdout.write('No anime found');
            process.exit();
         }
         const $ = cheerio.load(anime.data.content);
         const link = $('ul a')[0].attribs.href;
         await this.getList(link);
      } catch (e) {
         console.error('Something went wrong - 43');
         process.exit();
      }
   }

   async getList(link) {
      try {
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const epilist = _.chain(this.filter.episodes);
         const href = _.chain([]);
         list.each((i, e) => href.push(e.attribs.href));
         this.epNum = href.size();
         href
            .filter(
               item =>
                  epilist.includes(
                     Number(path.basename(item.split('-').pop()))
                  )
            )
            .each(async item => {
               try {
                  const { data } = await instance.get(item);
                  const $ = cheerio.load(data);
                  const url = new URL(
                     'https:' + $('.play-video iframe')[0].attribs.src
                  );
                  const id = url.searchParams.get('id');
                  const title = $('.video-info-left h1')[0].children[0].data;
                  const src = await this.getEpisodes(id);
                  const filename = path.basename(new URL(src).pathname);
                  const ext = path.extname(new URL(src).pathname);
                  const ep = Number(path.basename(item).split('-').pop());
                  this.data.push({ filename, ep, ext, id, title, src });
                  this.emit('loaded', this.data.size(), this.epNum, {
                     filename,
                     ep,
                     ext,
                     id,
                     title,
                     src,
                  });
               } catch (err) {
                  console.error('Something went wrong - 92');
                  process.exit();
               }
            });
      } catch (e) {
         console.error('Something went wrong - 98', e.message);
         process.exit();
      }
   }
   async getEpisodes(id) {
      try {
         const res = this.res;
         const { data } = await instance.get('/download', {
            params: {
               id,
            },
         });
         const $ = cheerio.load(data);
         const resList = $('.mirror_link .dowload a');
         let vid;
         if (res) {
            resList.each((i, e) => {
               if (e.children[0].data.search(res) > -1) {
                  vid = e.attribs.href;
               }
            });
         } else {
            resList.each((i, e) => {
               if (e.children[0].data.search(/HDP/gi) > -1) {
                  vid = e.attribs.href;
               }
            });
         }
         return vid;
      } catch (e) {
         console.error('Something went wrong - 128');
      }
   }

   download(format, dest) {
      this.on('loaded')
   }

   writeTo(output, cb) {
      fs.writeFileSync(output, null);
      const stream = fs.createWriteStream(output, { flags: 'a+' });
      this.on('loaded', (dataLength, length, ep) => {
         const url = ep.src;
         stream.cork();
         stream.write(`${url}\n`);
         process.nextTick(() => stream.uncork());
         if (dataLength === length) {
         }
      });
   }
}
