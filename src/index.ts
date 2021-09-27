import { parse } from 'node-html-parser';
import * as _ from 'lodash';
import { SearchResult } from './classes/search_result';
import Aigle from 'aigle';
import { instance } from './axios_instance';
import { AxiosError } from 'axios';
import debug from './debugger';

export async function getEpisodeData(link: string) {
   const anime = await instance.get(link);
   const document = parse(anime.data);
   const episodes = await Aigle.resolve(
      document.querySelectorAll('.video-info-left ul.listing .video-block a')
   ).map((a) => ({
      name: a.querySelector('.name').textContent.trim(),
      link: a.attributes.href,
      ep: Number(a.attributes.href.split('-').pop()),
   }));
   return _.sortBy(episodes, 'ep');
}

export async function term(
   term: string
): Promise<Array<SearchResult> | undefined> {
   const anime = await instance
      .get('/search.html', {
         params: {
            keyword: term,
         },
      })
      .catch((e: AxiosError) => {
         throw e.toJSON();
      });
   const document = parse(anime.data);
   const results = document.querySelectorAll('.listing .video-block a');
   if (!results.length) {
      throw {
         message: 'No anime data found',
         nanme: 'ANIMENOTFOUND',
      };
   }
   debug('Found %s results', results.length);
   const _arr = await Aigle.resolve(results).map(async (a) => {
      const href = a.attrs.href.toString();
      const episodes = await getEpisodeData(href);
      return new SearchResult({
         title: a
            .querySelector('.name')
            .textContent.replace(/episode\s+\d+/i, '')
            .trim(),
         link: href,
         episodes,
      });
   });
   return _arr;
}
