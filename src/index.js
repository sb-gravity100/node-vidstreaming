import cheerio from 'cheerio';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { EventEmitter } from 'events';
import async from 'async';
import path from 'path';
import fs from 'fs';

const url = 'https://gogo-stream.com';
const instance = axios.create({
   baseURL: url,
   headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axiosRetry(instance, { retries: 5 });

export class Vidstreaming extends EventEmitter {
   constructor(search, res) {
      super({ captureRejections: true });
      this.search = search;
      this.res = res;
      this.data = [];
      this.episodes();
   }

   async episodes() {
      try {
         process.stdout.write('Search started');
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: this.search,
            },
         });
         if (anime.data.content === '' || !anime.data.content) {
            process.stdout.clearLine()
            process.stdout.write('No anime found');
            process.exit()
         }
         const $ = cheerio.load(anime.data.content);
         const link = $('ul a')[0].attribs.href;
         await this.getList(link);
      } catch (e) {
         console.error('Something went wrong');
         process.exit()
      }
   }

   async getList(link) {
      try {
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const href = [];
         list.each((i, e) => href.push(e.attribs.href));
         this.epNum = href.length;
         async.each(
            href.sort((a, b) => a.ep - b.ep),
            async item => {
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
                  this.emit('loaded', this.data.length, this.epNum, {
                     filename,
                     ep,
                     ext,
                     id,
                     title,
                     src,
                  });
               } catch (err) {
                  console.error('Something went wrong');
                  process.exit()
               }
            }
         );
      } catch (e) {
         console.error('Something went wrong');
         process.exit()
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
         console.error(e);
      }
   }

   download(format, dest) {
      this.on('ready', async (err, episodes) => {
         if (err) throw err;
         async.each(
            episodes.sort((a, b) => a.ep - b.ep),
            async (data) => {
               try {
                  const stream = await axios.get(data.src, {
                     headers: { 'X-Requested-With': 'XMLHttpRequest' },
                     responseType: 'stream',
                  });
                  let filename;
                  if (format === 'title') {
                     filename = data.title + data.ext;
                  }
                  if (format === 'raw') {
                     filename = data.filename;
                  }
                  if (format === 'num') {
                     filename = data.ep + data.ext;
                  }
                  const out = fs.createWriteStream(path.join(dest, filename));
                  stream.data.pipe(out);
               } catch (e) {
                  console.error('Something went wrong');
                  process.exit()
               }
            }
         );
      });
   }

   writeTo(output, cb) {
      fs.writeFileSync(output, null);
      const stream = fs.createWriteStream(output, { flags: 'a+' });
      this.on('loaded', (dataLength, length, ep) => {
         const url = ep.src;
         stream.cork();
         stream.write(`${url}\n`);
         process.nextTick(() => stream.uncork());
         if (dataLength === length) {}
      });
   }
}
