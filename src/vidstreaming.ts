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

export interface FilterOptions {
   episodes?: number[];
   catch?: boolean;
}

export interface SearchData {
   title: string;
   link: string;
   eps: number;
}

export interface AnimeData {
   filename: string;
   ep: number;
   ext: string;
   id: string | null;
   title: string;
   src: string | undefined;
}

export interface VidstreamingInterface {
   res?: string;
   filter?: FilterOptions;
   data: Array<AnimeData>;
   term(
      term?: string,
      cb?: (result: Array<SearchData>) => void
   ): Promise<Array<SearchData> | undefined>;
   episodes(
      a?: string,
      cb?: (result: Array<AnimeData>) => void
   ): Promise<Array<AnimeData> | undefined>;
   download(output: string, list?: Array<AnimeData>): Promise<void>;
   writeTo(output: string, list?: Array<AnimeData>): Promise<void>;
}

export default class Vidstreaming
   extends EventEmitter
   implements VidstreamingInterface {
   res?: string;
   filter?: FilterOptions;
   data: Array<AnimeData>;

   constructor(res?: string, filter?: FilterOptions) {
      super();
      this.res = res;
      this.filter = filter;
      this.data = [];
   }

   async term(
      term: string,
      cb?: (result: Array<SearchData>) => void
   ): Promise<Array<SearchData> | undefined> {
      let result: Array<SearchData> = [];
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

         $('ul a').each((_i, e) => {
            result.push({
               title: e.children[0].data || 'No Title Found',
               link: e.attribs.href,
               eps: Number(e.attribs.href.split('-').pop()),
            });
         });
      } catch (err) {
         this.emit('error', err, 'error1');
      } finally {
         if (cb) {
            cb(result);
         } else {
            return result;
         }
      }
   }

   async episodes(
      a: string,
      cb?: (result: Array<AnimeData>) => void
   ): Promise<Array<AnimeData> | undefined> {
      let result;
      try {
         let epData: any;
         epData = await this.getList(a);
         result = epData;
      } catch (e) {
         if (this.filter && this.filter.catch) {
            throw e;
         } else {
            this.emit('error', e, 'error2');
         }
      } finally {
         this.emit('ready', result);
         if (cb) {
            cb(result);
         } else {
            return result;
         }
      }
   }

   protected async getList(
      link: string,
      cb?: (result: Array<AnimeData>) => void
   ): Promise<Array<AnimeData> | undefined> {
      let results, newHref: any;
      try {
         let epNum: number;
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const href: string[] = [];
         list.each((_i, e) => href.push(e.attribs.href));
         epNum = href.length;
         const asynciterator = async (
            item: string
         ): Promise<AnimeData | undefined> => {
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
            const animeData: AnimeData = {
               filename,
               ep,
               ext,
               id,
               title,
               src,
            };
            this.data.push(animeData);
            this.emit('loaded', this.data, epNum, animeData);
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
         if (cb) {
            cb(results);
         } else {
            return results;
         }
      }
   }
   protected async getEpisodes(
      id: string | null,
      cb?: (result: string) => void
   ): Promise<string | undefined> {
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
      if (cb) {
         cb(results);
      } else {
         return results;
      }
   }

   async download(output: string, list?: Array<AnimeData>): Promise<void> {
      const downloadHandler = (data: Array<AnimeData>): void => {
         let i = 0;
         const queue = async (): Promise<void> => {
            const anime = await axios.get(data[i].src, {
               responseType: 'stream',
            });
            const source = fs.createReadStream(anime.data);
            const stream = fs.createWriteStream(
               path.join(output, `EP.${data[i].ep + data[i].ext}`)
            );
            stream.on('finish', () => {
               console.log(data[i].title, 'Done');
               i++;
               queue();
            });
            source.on('error', err => {
               console.log(err.message);
               i = 0;
            });
            stream.on('error', err => {
               console.log(err.message);
            });
            source.on('data', data => {
               this.emit('download', data);
               source.pipe(stream);
            });
            source.on('end', () => {
               stream.end();
            });
         };
      };
      try {
         if (list) {
            downloadHandler(list);
         } else {
            this.on('ready', downloadHandler);
         }
      } catch (e) {
         if (this.filter && this.filter.catch) {
            throw e;
         } else {
            this.emit('error', e);
         }
      }
   }

   async writeTo(
      output: string,
      list?: Array<AnimeData>,
      cb?: () => void
   ): Promise<void> {
      try {
         fs.writeFileSync(output, '');
         const stream = fs.createWriteStream(output, { flags: 'a+' });
         const outputHandler = (data: Array<AnimeData>): void => {
            const data_string = data.map(d => d.src).join('\n');
            this.emit('write');
            stream.end(data_string);
         };
         if (list) {
            outputHandler(list);
         } else {
            this.on('ready', data => outputHandler(data));
         }
      } catch (e) {
         if (this.filter && this.filter.catch) {
            throw e;
         } else {
            this.emit('error', e);
         }
      }
      if (cb) cb();
   }
}
