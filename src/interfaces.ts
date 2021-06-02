export type SearchResultJSON = {
  title: string;
  link: string;
  epNum: number;
  episodes: EpisodeDataJSON[];
};

export type EpisodeDataJSON = {
  name: string;
  link?: string;
  ep: number;
  sources?: MirrorLink<any, string> | any;
};

export type AnimeData = {
  id?: string;
  title: string;
  ep: number;
  filename: string;
  src?: string;
};

export type MirrorLink<T extends number | null, LinkType> = {
  code: T;
  links: LinkType;
  name: string;
};

export type FCDNLinks = {
  file?: string;
  label?: string;
};

export type EpisodesOptions = {
  filter?: string;
};

export type GlobalOptions = {
  verbose: boolean;
};

export type TermOptions = GlobalOptions & {}
