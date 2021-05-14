import { SearchResult } from './classes/search_result'

export type VResults<T> = Array<T>
export type VResult<T> = T

export type SearchResultJSON = {
   title: string;
   link: string;
   epNum: number;
   episodes: VResults<EpisodeDataJSON>;
}

export type EpisodeDataJSON = {
   name: string;
   link: string;
   ep: number;
}

export type AnimeData = {
   id: string | null;
   title: string;
   ep: number;
   filename: string;
   src: string | undefined;
}

export type MirrorLink<T extends number> = {
   code: T;
   links: string | string[];
   name: string
}
