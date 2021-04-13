import axios from 'axios';
import axiosRetry from 'axios-retry';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
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
   download(
      output: string,
      list?: Array<AnimeData>,
      cb?: () => void
   ): Promise<void>;
   writeTo(
      output: string,
      list?: Array<AnimeData>,
      cb?: () => void
   ): Promise<void>;
   getFromStreamSB(
      id: string | null,
      cb?: (result: string) => void
   ): Promise<string | undefined>;
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
      let result: Array<AnimeData>;
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
      let results: Array<AnimeData>, newHref: any;
      try {
         let epNum: number;
         const { data } = await instance.get(link);
         const $ = cheerio.load(data);
         const list = $('.listing.items.lists .video-block a');
         const href: string[] = [];
         list.each((_i, e) => href.push(e.attribs.href));
         const asynciterator = async (
            item: string
         ): Promise<AnimeData | undefined> => {
            const anime = await instance.get(item);
            const $ = cheerio.load(anime.data);
            const url = new URL(
               'https:' + $('.play-video iframe')[0].attribs.src
            );
            const id = url.searchParams.get('id');
            const title = $('.video-info-left h1')[0].children[0].data;
            const src = await this._getEpisodes(id);
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
            epNum = href.filter(ref =>
               epilist.includes(Number(ref.split('-').pop()))
            ).length;
            newHref = await Aigle.resolve(href)
               .filter(ref => epilist.includes(Number(ref.split('-').pop())))
               .map(asynciterator);
         } else {
            epNum = href.length;
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
   protected async _getEpisodes(
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

   protected _deletePath(_path: string, _files: Array<string>): void {
      if (_files.length < 1) {
         return;
      }
      _files.forEach(file => {
         fs.unlink(path.join(_path, file), err => {
            if (err.code === 'ENOENT') {
               console.error('No file present. Exiting...');
               return;
            }
            if (err) this.emit('error', err);
            return;
         });
      });
   }

   async download(
      output: string,
      list: Array<AnimeData>,
      cb?: () => void
   ): Promise<void> {
      try {
         const downloadHandler = async (
            data: Array<AnimeData>
         ): Promise<void> => {
            let i = 0;
            let filenames: Array<string> = [];
            fs.access(output, fs.constants.F_OK, err => {
               if (err) {
                  fs.mkdirSync(output);
               }
            });
            const queue = async (): Promise<void> => {
               try {
                  const anime = await axios.get(data[i].src, {
                     responseType: 'stream',
                  });
                  const filename = `EP.${data[i].ep}${
                     this.res ? '.' + this.res + 'p' : ''
                  }${data[i].ext}`;
                  const filepath = path.join(output, filename);
                  filenames.push(filename);
                  const data_length = anime.headers['content-length'];
                  const human_total = require('pretty-bytes')(
                     Number(data_length)
                  );
                  this.emit('queue', { cur: i, total: data.length }, filename, {
                     length: data_length,
                     human: human_total,
                  });
                  const source = anime.data;
                  const stream = fs.createWriteStream(filepath);
                  stream.on('finish', () => {
                     if (i === data.length - 1) {
                        this.emit('done');
                     } else {
                        i++;
                        queue();
                     }
                  });
                  source.on('error', err => {
                     console.log(
                        err.message || 'Something went wrong.',
                        'Deleting files...'
                     );
                     i = 0;
                     this._deletePath(output, filenames);
                  });
                  stream.on('error', err => {
                     console.log(
                        err.message || 'Something went wrong.',
                        'Deleting files...'
                     );
                     this._deletePath(output, filenames);
                  });
                  source.on('data', chunk => {
                     this.emit(
                        'download',
                        chunk,
                        stream.bytesWritten,
                        filename
                     );
                  });
                  source.on('end', () => {
                     stream.end();
                  });
                  source.pipe(stream);
               } catch (e) {
                  throw e;
               }
            };
            await queue();
         };
         downloadHandler(list);
      } catch (e) {
         if (this.filter && this.filter.catch) {
            throw e;
         } else {
            this.emit('error', e);
         }
      }
      if (cb) cb();
   }

   async writeTo(
      output: string,
      list: Array<AnimeData>,
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

   async getFromStreamSB(
      id: string | null,
      cb?: (result: string) => void
   ): Promise<string | undefined> {
      
   }
}
