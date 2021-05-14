import { parse } from 'node-html-parser';
import * as _ from 'lodash';
import { VResults } from './interfaces';
import { SearchResult } from './classes/search_result';
import Aigle from 'aigle';
import { instance } from './axios_instance'

/**
 * Main class
 * @example
 * ```javascript
 * const { Vidstreaming } = require('node-vidstreaming')
 * var Anime = new Vidstreaming()
 * ```
 */
export class Vidstreaming {
   constructor() {}

   async term(term: string): Promise<VResults<SearchResult> | undefined> {
      try {
         const anime = await instance.get('/ajax-search.html', {
            params: {
               keyword: term,
            },
         });
         if (anime.data.content === '' || !anime.data.content) {
            throw {
               message: 'No anime data found',
               code: 'NOTFOUND',
            };
         }
         const document = parse(anime.data.content);

         const _arr = await Aigle.resolve(
            document.querySelectorAll('ul a')
         ).map(async a => {
            const href = a.attrs.href.toString();
            const epNum = Number(href.split('-').pop());
            const episodes = await this.getEpisodeData(href);
            return new SearchResult({
               title: a.textContent,
               link: href,
               epNum,
               episodes,
            });
         });
         return _arr;
      } catch (e) {
         if (e.isAxiosError) {
            throw {
               name: e.name,
               code: e.code,
               status: e.status,
               message: 'Failed to search anime',
            };
         }
      }
   }

   private async getEpisodeData(link: string) {
      const anime = await instance.get(link);
      const document = parse(anime.data);
      const episodes = await Aigle.resolve(
         document.querySelectorAll('.video-info-left ul.listing .video-block a')
      ).map(a => ({
         name: a.querySelector('.name').textContent.trim(),
         link: a.attributes.href,
         ep: Number(a.attributes.href.split('-').pop()),
      }));
      return _.sortBy(episodes, 'ep');
   }
}
