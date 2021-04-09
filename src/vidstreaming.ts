import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as cheerio from 'cheerio';
// import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';
import { Aigle } from 'aigle';

const url = 'https://gogo-stream.com';
const instance = axios.create({
   baseURL: url,
   headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axiosRetry(instance, { retries: 5 });

interface FilterInterface {
   episodes?: number[];
   async?: boolean;
   catch?: boolean;
}

interface SearchListItem {
   title: string;
   link: string;
   eps: number;
}

interface DataItem {
   filename: string;
   ep: number;
   ext: string;
   id: string | null;
   title: string;
   src: string;
}

interface VidstreamingInterface {
   search?: string;
   res?: string;
   filter?: FilterInterface;
   data: Array<DataItem>;
   searchlist: Array<SearchListItem>;
   epNum: number;
   term(
      term?: string,
      cb?: (result: Array<SearchListItem>) => void
   ): Promise<Array<SearchListItem>>;
   episodes(
      a?: string,
      cb?: (result: Array<DataItem>) => void
   ): Promise<Array<DataItem>>;
   getList(
      link: string,
      cb?: (result: Array<DataItem>) => void
   ): Promise<Array<DataItem>>;
   getEpisodes(
      id: string | null,
      cb?: (result: string) => void
   ): Promise<string>;
}

class Vidstreaming extends EventEmitter implements VidstreamingInterface {
   search?: string;
   res?: string;
   filter?: FilterInterface;
   data: Array<DataItem>;
   searchlist: Array<SearchListItem>;
   epNum: number;

   constructor(search?: string, res?: string, filter?: FilterInterface) {
      super();
      this.search = search;
      this.res = res;
      this.filter = filter || {};
      this.data = [];
      this.searchlist = [];
      this.epNum = 0;
   }

   async term(
      term?: string,
      cb?: (result: Array<SearchListItem>) => void
   ): Promise<Array<SearchListItem>> {
      let result: any;
      try {
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: term,
            },
         });
         if (anime.data.content === '' || !anime.data.content) {
            throw {
               message: 'No anime data found',
               code: 'ANINOTFOUND',
               name: 'Error',
            };
         }
         const $ = cheerio.load(anime.data.content);
         $('ul a').each((i, e): number => {
            this.searchlist.push({
               title: e.children[0].data || 'No Title Found',
               link: e.attribs.href,
               eps: Number(e.attribs.href.split('-').pop()),
            });
            return i;
         });
         result = this.searchlist;
      } catch (err) {
         this.emit('error', err, 'error1');
      } finally {
         if (cb) cb(result);
         return result;
      }
   }

   async episodes(
      a?: string,
      cb?: (result: Array<DataItem>) => void
   ): Promise<Array<DataItem>> {
      let result;
      try {
         let epData: any;
         if (!a) {
            const anime = await instance.get('/ajax-search.html', {
               params: {
                  keyword: this.search,
               },
            });
            if (anime.data.content === '' || !anime.data.content) {
               throw {
                  message: 'No anime data found',
                  code: 'ANINOTFOUND',
                  name: 'Error',
               };
            }
            const $ = cheerio.load(anime.data.content);
            const link = $('ul a')[0].attribs.href;
            epData = await this.getList(link);
         } else {
            epData = await this.getList(a);
         }
         result = epData;
      } catch (e) {
         if (this.filter && this.filter.catch) {
            throw e;
         } else {
            this.emit('error', e, 'error2');
         }
      } finally {
         if (cb) cb(result);
         return result;
      }
   }

   async getList(
      link: string,
      cb?: (result: Array<DataItem>) => void
   ): Promise<Array<DataItem>> {
      let results, newHref: any;
      try {
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const href: string[] = [];
         list.each((_i, e) => href.push(e.attribs.href));
         this.epNum = href.length;
         const asynciterator = async (
            item: string
         ): Promise<DataItem | undefined> => {
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
            const animeData: DataItem = {
               filename,
               ep,
               ext,
               id,
               title,
               src,
            };
            this.data.push(animeData);
            if (this.filter && this.filter.async) {
               this.emit('loaded', this.data.length, this.epNum, animeData);
            }
            return animeData;
         };
         if (this.filter && this.filter.episodes) {
            const epilist = this.filter.episodes;
            newHref = await Aigle.resolve(href)
               .filter(ref => epilist.includes(Number(ref.split('-').pop())))
               .map(asynciterator);
         } else {
            newHref = await Aigle.resolve(href).map(asynciterator);
         }
      } catch (err) {
         if (this.filter && this.filter.catch) {
            throw err;
         } else {
            this.emit('error', err, 'error3');
         }
      } finally {
         results = newHref.sort((a: any, b: any) => a.ep - b.ep);
         if (cb) cb(results);
         return results;
      }
   }
   async getEpisodes(
      id: string | null,
      cb?: (result: string) => void
   ): Promise<string> {
      let results: any;
      try {
         if (this.res) {
            const res = this.res;
            const { data } = await instance.get('/download', {
               params: {
                  id,
               },
            });
            const resList: string[] = [];
            const $ = cheerio.load(data);
            $('.mirror_link .dowload a').each((_i, e) =>
               resList.push(e.attribs.href)
            );
            results = resList.filter(i => i.toString().search(res) > -1)[0];
         } else {
            const anime = await instance.get('/ajax.php', {
               params: {
                  id,
               },
            });
            results = anime.data.source.shift().file;
         }
      } catch (err) {
         if (this.filter && this.filter.catch) {
            throw err;
         } else {
            this.emit('error', err, 'getEpisodes');
         }
      }
      if (cb) cb(results);
      return results;
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
