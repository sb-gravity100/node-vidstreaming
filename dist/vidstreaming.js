"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosRetry = _interopRequireDefault(require("axios-retry"));

var cheerio = _interopRequireWildcard(require("cheerio"));

var path = _interopRequireWildcard(require("path"));

var _events = require("events");

var _aigle = require("aigle");

const url = 'https://gogo-stream.com';

const instance = _axios.default.create({
  baseURL: url,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

(0, _axiosRetry.default)(instance, {
  retries: 5
});

class Vidstreaming extends _events.EventEmitter {
  constructor(search, res, filter) {
    super();
    (0, _defineProperty2.default)(this, "search", void 0);
    (0, _defineProperty2.default)(this, "res", void 0);
    (0, _defineProperty2.default)(this, "filter", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "searchlist", void 0);
    (0, _defineProperty2.default)(this, "epNum", void 0);
    this.search = search;
    this.res = res;
    this.filter = filter || {};
    this.data = [];
    this.searchlist = [];
    this.epNum = 0;
  }

  async term(term, cb) {
    let result;

    try {
      const anime = await instance.get('/ajax-search.html', {
        params: {
          keyword: term
        }
      });

      if (anime.data.content === '' || !anime.data.content) {
        throw {
          message: 'No anime data found',
          code: 'ANINOTFOUND',
          name: 'Error'
        };
      }

      const $ = cheerio.load(anime.data.content);
      $('ul a').each((i, e) => {
        this.searchlist.push({
          title: e.children[0].data || 'No Title Found',
          link: e.attribs.href,
          eps: Number(e.attribs.href.split('-').pop())
        });
        return i;
      });
      result = this.searchlist;
    } catch (err) {
      this.emit('error', err, 'error1');
    } finally {
      if (cb) cb(result);
      return result;
    }
  }

  async episodes(a, cb) {
    let result;

    try {
      let epData;

      if (!a) {
        const anime = await instance.get('/ajax-search.html', {
          params: {
            keyword: this.search
          }
        });

        if (anime.data.content === '' || !anime.data.content) {
          throw {
            message: 'No anime data found',
            code: 'ANINOTFOUND',
            name: 'Error'
          };
        }

        const $ = cheerio.load(anime.data.content);
        const link = $('ul a')[0].attribs.href;
        epData = await this.getList(link);
      } else {
        epData = await this.getList(a);
      }

      result = epData;
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e, 'error2');
      }
    } finally {
      if (cb) cb(result);
      return result;
    }
  }

  async getList(link, cb) {
    let results, newHref;

    try {
      const {
        data
      } = await instance.get(link);
      const $ = cheerio.load(data);
      const list = $('.listing.items.lists .video-block a');
      const href = [];
      list.each((_i, e) => href.push(e.attribs.href));
      this.epNum = href.length;

      const asynciterator = async (item) => {
        const {
          data
        } = await instance.get(item);
        const $ = cheerio.load(data);
        const url = new URL('https:' + $('.play-video iframe')[0].attribs.src);
        const id = url.searchParams.get('id');
        const title = $('.video-info-left h1')[0].children[0].data;
        const src = await this.getEpisodes(id);
        const srcUrl = new URL(src).pathname;
        const filename = path.basename(srcUrl);
        const ext = path.extname(srcUrl);
        const ep = Number(path.basename(item).split('-').pop());
        const animeData = {
          filename,
          ep,
          ext,
          id,
          title,
          src
        };
        this.data.push(animeData);

        if (this.filter && this.filter.async) {
          this.emit('loaded', this.data.length, this.epNum, animeData);
        }

        return animeData;
      };

      if (this.filter && this.filter.episodes) {
        const epilist = this.filter.episodes;
        newHref = await _aigle.Aigle.resolve(href).filter(ref => epilist.includes(Number(ref.split('-').pop()))).map(asynciterator);
      } else {
        newHref = await _aigle.Aigle.resolve(href).map(asynciterator);
      }
    } catch (err) {
      if (this.filter && this.filter.catch) {
        throw err;
      } else {
        this.emit('error', err, 'error3');
      }
    } finally {
      results = newHref.sort((a, b) => a.ep - b.ep);
      if (cb) cb(results);
      return results;
    }
  }

  async getEpisodes(id, cb) {
    let results;

    try {
      if (this.res) {
        const res = this.res;
        const {
          data
        } = await instance.get('/download', {
          params: {
            id
          }
        });
        const resList = [];
        const $ = cheerio.load(data);
        $('.mirror_link .dowload a').each((_i, e) => resList.push(e.attribs.href));
        results = resList.filter(i => i.toString().search(res) > -1)[0];
      } else {
        const anime = await instance.get('/ajax.php', {
          params: {
            id
          }
        });
        results = anime.data.source.shift().file;
      }
    } catch (err) {
      if (this.filter && this.filter.catch) {
        throw err;
      } else {
        this.emit('error', err, 'getEpisodes');
      }
    }

    if (cb) cb(results);
    return results;
  }

}

var _default = Vidstreaming;
exports.default = _default;