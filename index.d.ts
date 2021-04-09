/// <reference types="node" />
declare module "vidstreaming" {
    import { EventEmitter } from 'events';
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
        term(term?: string, cb?: (result: Array<SearchData>) => void): Promise<Array<SearchData> | undefined>;
        episodes(a?: string, cb?: (result: Array<AnimeData>) => void): Promise<Array<AnimeData> | undefined>;
        download(output: string, list?: Array<AnimeData>): Promise<void>;
        writeTo(output: string, list?: Array<AnimeData>): Promise<void>;
    }
    export default class Vidstreaming extends EventEmitter implements VidstreamingInterface {
        res?: string;
        filter?: FilterOptions;
        data: Array<AnimeData>;
        constructor(res?: string, filter?: FilterOptions);
        term(term: string, cb?: (result: Array<SearchData>) => void): Promise<Array<SearchData> | undefined>;
        episodes(a: string, cb?: (result: Array<AnimeData>) => void): Promise<Array<AnimeData> | undefined>;
        protected getList(link: string, cb?: (result: Array<AnimeData>) => void): Promise<Array<AnimeData> | undefined>;
        protected getEpisodes(id: string | null, cb?: (result: string) => void): Promise<string | undefined>;
        download(output: string, list?: Array<AnimeData>): Promise<void>;
        writeTo(output: string, list?: Array<AnimeData>): Promise<void>;
    }
}
declare module "utils/url_utils" {
    import { SearchData, FilterOptions } from "vidstreaming";
    export function searchUrls(search: string): Promise<Array<SearchData> | undefined>;
    export function writeUrls(anime: SearchData, output: string, res?: string, options?: FilterOptions): Promise<void>;
}
