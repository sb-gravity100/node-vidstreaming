import { EventEmitter } from 'events';
import { parse } from 'node-html-parser';
import { Aigle } from 'aigle';
import * as _ from 'lodash';
import { instance } from '../axios_instance';

/** Base class */
export class Base extends EventEmitter {
   constructor() {
      super();
   }

   protected episodes() {}

   protected async episode(link: string) {
      const episode = await instance.get(link);
      const document = parse(episode.data);
      const src = new URL(
         'https:' +
            document.querySelector('div.watch_play > div.play-video > iframe')
               .attributes.src
      );
      const episodeID = src.searchParams.get('id');
   }

   protected async getPossibleDownloads(id: string) {
      const download = await instance.get('/download', {
         params: {
            id,
         },
      });
      const document = parse(download.data);
      const mirrors = document.querySelectorAll('.mirror_link dowload a');
      const supportedMirrors = await Aigle.resolve(mirrors)
         .map(e => ({
            links: e.getAttribute('href'),
            name: e.textContent.trim(),
         }))
         .filter(e => /(HDP|xstreamcdn)/i.test(e.name))
         .map(e => {
            e.name = e.name.replace(/(download|\s)/i, '').trim();
            if (e.name.match(/HDP/)) {
               return {
                  ...e,
                  code: 0,
               };
            }
            if (e.name.match(/xstreamcdn/i)) {
               return {
                  ...e,
                  code: 1,
               };
            }
            return {
               ...e,
               code: null,
            };
         });
   }
}
