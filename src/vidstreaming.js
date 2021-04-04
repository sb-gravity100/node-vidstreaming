import _ from 'lodash';
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
      // if filter.async option is true then you don't need to call the episode fetcher...
      if (this.filter.async) {
         console.log('  So you have chosen async');
         this.episodes();
      }
   }

   async search(term, cb) {
      try {
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: term,
            },
         });
         const $ = cheerio.load(anime.data.content);
         const searchlist = [];
         $('ul a').each((i, e) =>
            searchlist.push({
               title: e.firstChild.data,
               link: e.attribs.href,
            })
         );
         cb(null, searchlist);
         return searchlist;
      } catch (e) {
         cb(e, null);
      }
   }

   async episodes(cb) {
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
         const epData = await this.getList(link);
         this.emit('ready', epData);
         console.log('list taken');
         if (cb) {
            cb(null, epData);
         }
      } catch (e) {
         this.emit('error', e, 72);
         if (cb) {
            cb(null, epData);
         }
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
         console.log('pushed');
         this.epNum = href.size();
         const asyncGetEpisodes = async item => {
            try {
               console.log('yojooo');
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
               // console.error('Something went wrong - 102\n', e.message);
               this.emit('error', e, 102);
            }
         };
         if (this.filter.episodes) {
            const newHref = href.filter(item => {
               epilist.includes(Number(path.basename(item.split('-').pop())));
               console.log('filtered');
            });
            newHref
               .sortBy(i => Number(path.basename(i.split('-').pop())))
               .value()
               .forEach(i => asyncGetEpisodes(i));
         } else {
            console.log('Not filtered');
            href
               .sortBy(i => Number(path.basename(i.split('-').pop())))
               .value()
               .forEach(i => asyncGetEpisodes(i));
         }
      } catch (e) {
         // console.error('Something went wrong - 98\n', err.message);
         this.emit('error', e, 106);
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
         const resList = _.chain([]);
         $('.mirror_link .dowload a').each((i, e) =>
            resList.push(e.attribs.href)
         );
         return resList.filter(i => i.search(res || /HDP/g) > -1).head();
      } catch (e) {
         // console.error('Something went wrong - 128\n', e.message);
         this.emit('error', e, 128);
      }
   }

   download(format, dest) {
      // this.on('loaded');
   }

   writeTo(output, cb) {
      fs.writeFileSync(output, null);
      const stream = fs.createWriteStream(output, { flags: 'a+' });
      const doneHandler = item => {
         const url = item.src;
         stream.cork();
         stream.write(`${url}\n`);
         process.nextTick(() => stream.uncork());
      };
      if (filter.async) {
         this.on('loaded', (dataLength, length, ep) => {
            if (dataLength === length) {
               doneHandler(ep);
               sortUrls();
               process.exit(0);
            } else {
               doneHandler(ep);
            }
         });
      } else {
         vid.episodes().then(data => {
            data.forEach(d => doneHandler(d));
            cb(data);
         });
      }
      // Error listener
      vid.on('error', (err, line) => {
         cb(err);
         fs.unlinkSync(output);
         process.exit(1);
      });
   }
}
