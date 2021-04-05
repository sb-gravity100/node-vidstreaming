import axios from 'axios';
import axiosRetry from 'axios-retry';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { Aigle } from 'aigle';

const url = 'https://gogo-stream.com';
const instance = axios.create({
   baseURL: url,
   headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axiosRetry(instance, { retries: 5 });

class Vidstreaming extends EventEmitter {
   constructor(search, res, filter) {
      super();
      this.search = search;
      this.res = res;
      this.filter = filter;
      this.data = [];
      this.searchlist = [];
   }

   async term(term, cb) {
      let result;
      try {
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: term,
            },
         });
         if (anime.data.content === '' || !anime.data.content) {
            process.stdout.clearLine();
            process.stdout.write('No anime found');
            process.exit();
         }
         const $ = cheerio.load(anime.data.content);
         $('ul a').each((i, e) =>
            this.searchlist.push({
               title: e.firstChild.data,
               link: e.attribs.href,
            })
         );
         result = this.searchlist;
         return result;
      } catch (err) {
         this.emit('error', err, 'Term');
      } finally {
         if (cb) cb(result);
      }
   }

   async episodes(a, cb) {
      let result;
      try {
         let epData;
         if (!a) {
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
            epData = await this.getList(link);
         } else {
            epData = await this.getList(a);
         }
         this.emit('ready', epData);
         result = epData;
         return epData
      } catch (e) {
         this.emit('error', e, 'episodes');
      } finally {
         if (cb) cb(result);
      }
   }

   async getList(link, cb) {
      let results, newHref;
      try {
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const href = [];
         list.each((i, e) => href.push(e.attribs.href));
         this.epNum = href.length;
         const asynciterator = async item => {
            const { data } = await instance.get(item);
            const $ = cheerio.load(data);
            const url = new URL(
               'https:' + $('.play-video iframe')[0].attribs.src
            );
            const id = url.searchParams.get('id');
            const title = $('.video-info-left h1')[0].children[0].data;
            const src = await this.getEpisodes(id);
            const srcUrl = new URL(src).pathname;
            const filename = path.basename(srcUrl);
            const ext = path.extname(srcUrl);
            const ep = Number(path.basename(item).split('-').pop());
            const animeData = {
               filename,
               ep,
               ext,
               id,
               title,
               src,
            };
            this.data.push(animeData.id);
            this.filter &&
               this.filter.async &&
               this.emit('loaded', this.data.length, this.epNum, animeData);
            return animeData;
         };
         if (this.filter) {
            if (this.filter.episodes) {
               const epilist = this.filter.episodes;
               newHref = await Aigle.resolve(href)
                  .filter(ref => epilist.includes(Number(ref.split('-').pop())))
                  .map(asynciterator)
                  .sortBy('ep');
            }
         } else {
            console.log('Not filtered');
            newHref = await Aigle.resolve(href).map(asynciterator).sortBy('ep');
         }
         return newHref;
      } catch (err) {
         // console.error('Something went wrong - 98\n', err.message);
         this.emit('error', err, 'getList');
      } finally {
         results = newHref;
         if (cb) cb(results);
      }
   }
   async getEpisodes(id, cb) {
      let results;
      try {
         if (this.res) {
            const res = this.res;
            const { data } = await instance.get('/download', {
               params: {
                  id,
               },
            });
            const resList = [];
            $('.mirror_link .dowload a').each((i, e) =>
               resList.push(e.attribs.href)
            );
            results = resList.filter(i => i.toString().search(res) > -1)[0];
         } else {
            const anime = await instance.get('/ajax.php', {
               params: {
                  id,
               }
            });
            results = anime.data.source.shift().file
         }
         return results;
      } catch (err) {
         // console.error('Something went wrong - 128\n', e.message);
         this.emit('error', err, 'getEpisodes');
      } finally {
         if (cb) cb(results);
      }
   }

   /* download(format, dest) {
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
   } */
}

export default Vidstreaming;
