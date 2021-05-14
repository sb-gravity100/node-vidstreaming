import { SearchResultJSON, EpisodeDataJSON } from '../interfaces';
import { PropClass } from './prop_class';
declare class EpisodeData extends PropClass<EpisodeDataJSON> {
    constructor(props: EpisodeDataJSON);
    get name(): string;
    get link(): string;
    get ep(): number;
}
export declare class SearchResult extends PropClass<SearchResultJSON> {
    private _episodes;
    constructor(props: SearchResultJSON);
    get title(): string;
    get link(): string;
    get epNum(): number;
    get episodes(): EpisodeData[];
}
export {};
