import { VResults } from './interfaces';
import { SearchResult } from './classes/search_result';
/**
 * Main class
 * @example
 * ```javascript
 * const { Vidstreaming } = require('node-vidstreaming')
 * var Anime = new Vidstreaming()
 * ```
 */
export declare class Vidstreaming {
    constructor();
    term(term: string): Promise<VResults<SearchResult> | undefined>;
    private getEpisodeData;
}
