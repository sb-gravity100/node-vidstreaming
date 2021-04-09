/// <reference types="node" />
declare module "vidstreaming" {
    import { EventEmitter } from 'events';
    interface FilterInterface {
        episodes?: number[];
        async?: boolean;
    }
    interface SearchListItem {
        title: string;
        link: string;
        eps: number;
    }
    interface DataItem {
        filename: string;
        ep: number;
        ext: string;
        id: string | null;
        title: string;
        src: string;
    }
    interface VidstreamingInterface {
        search?: string;
        res?: string;
        filter?: FilterInterface;
        data: Array<DataItem>;
        searchlist: Array<SearchListItem>;
        epNum: number;
        term(term?: string, cb?: (result: Array<SearchListItem>) => void): Promise<Array<SearchListItem>>;
        episodes(a?: string, cb?: (result: Array<DataItem>) => void): Promise<Array<DataItem>>;
        getList(link: string, cb?: (result: Array<DataItem>) => void): Promise<Array<DataItem>>;
        getEpisodes(id: string | null, cb?: (result: string) => void): Promise<string>;
    }
    class Vidstreaming extends EventEmitter implements VidstreamingInterface {
        search?: string;
        res?: string;
        filter?: FilterInterface;
        data: Array<DataItem>;
        searchlist: Array<SearchListItem>;
        epNum: number;
        constructor(search?: string, res?: string, filter?: FilterInterface);
        term(term?: string, cb?: (result: Array<SearchListItem>) => void): Promise<Array<SearchListItem>>;
        episodes(a?: string, cb?: (result: Array<DataItem>) => void): Promise<Array<DataItem>>;
        getList(link: string, cb?: (result: Array<DataItem>) => void): Promise<Array<DataItem>>;
        getEpisodes(id: string | null, cb?: (result: string) => void): Promise<string>;
    }
    export default Vidstreaming;
}
