import { SearchResultJSON, EpisodeDataJSON } from '../interfaces';
import { PropClass } from './prop_class'
import * as _ from 'lodash'

class EpisodeData extends PropClass<EpisodeDataJSON> {
   constructor(props: EpisodeDataJSON) {
      super(props)
   }

   get name() {
      return this._props.name;
   }
   get link() {
      return this._props.link;
   }
   get ep() {
      return this._props.ep;
   }
}

export class SearchResult extends PropClass<SearchResultJSON> {
   private _episodes: EpisodeData[];

   constructor(props: SearchResultJSON) {
      super(props)
      this._episodes = _.map(props.episodes, ep => new EpisodeData(ep));
   }

   get title() {
      return this._props.title;
   }
   get link() {
      return this._props.link;
   }
   get epNum() {
      return this._props.epNum;
   }
   get episodes() {
      return this._episodes;
   }
}
