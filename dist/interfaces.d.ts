export declare type VResults<T> = Array<T>;
export declare type VResult<T> = T;
export declare type SearchResultJSON = {
    title: string;
    link: string;
    epNum: number;
    episodes: VResults<EpisodeDataJSON>;
};
export declare type EpisodeDataJSON = {
    name: string;
    link: string;
    ep: number;
};
export declare type AnimeData = {
    id: string | null;
    title: string;
    ep: number;
    filename: string;
    src: string | undefined;
};
export declare type MirrorLink<T extends number> = {
    code: T;
    links: string | string[];
    name: string;
};
