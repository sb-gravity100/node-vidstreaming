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

var fs = _interopRequireWildcard(require("fs"));

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
  constructor(res, filter) {
    super();
    (0, _defineProperty2.default)(this, "res", void 0);
    (0, _defineProperty2.default)(this, "filter", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    this.res = res;
    this.filter = filter;
    this.data = [];
  }

  async term(term, cb) {
    let result = [];

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
      $('ul a').each((_i, e) => {
        result.push({
          title: e.children[0].data || 'No Title Found',
          link: e.attribs.href,
          eps: Number(e.attribs.href.split('-').pop())
        });
      });
    } catch (err) {
      this.emit('error', err, 'error1');
    } finally {
      if (cb) {
        cb(result);
      } else {
        return result;
      }
    }
  }

  async episodes(a, cb) {
    let result;

    try {
      let epData;
      epData = await this.getList(a);
      result = epData;
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e, 'error2');
      }
    } finally {
      if (cb) {
        cb(result);
      } else {
        return result;
      }
    }
  }

  async getList(link, cb) {
    let results, newHref;

    try {
      let epNum;
      const {
        data
      } = await instance.get(link);
      const $ = cheerio.load(data);
      const list = $('.listing.items.lists .video-block a');
      const href = [];
      list.each((_i, e) => href.push(e.attribs.href));
      epNum = href.length;

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
        this.emit('loaded', this.data, epNum, animeData);
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
      this.emit('ready', results);

      if (cb) {
        cb(results);
      } else {
        return results;
      }
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

    if (cb) {
      cb(results);
    } else {
      return results;
    }
  }

  async download(output, list) {
    const downloadHandler = data => {
      let i = 0;

      const queue = async () => {
        const anime = await _axios.default.get(data[i].src, {
          responseType: 'stream'
        });
        const source = fs.createReadStream(anime.data);
        const stream = fs.createWriteStream(path.join(output, `EP.${data[i].ep + data[i].ext}`));
        stream.on('finish', () => {
          console.log(data[i].title, 'Done');
          i++;
          queue();
        });
        source.on('error', err => {
          console.log(err.message);
          i = 0;
        });
        stream.on('error', err => {
          console.log(err.message);
        });
        source.on('data', data => {
          this.emit('download', data);
          source.pipe(stream);
        });
        source.on('end', () => {
          stream.end();
        });
      };
    };

    try {
      if (list) {
        downloadHandler(list);
      } else {
        this.on('ready', downloadHandler);
      }
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e);
      }
    }
  }

  async writeTo(output, list) {
    const stream = fs.createWriteStream(output);

    const outputHandler = data => {};

    try {
      if (list) {
        outputHandler(list);
      } else {
        this.on('ready', outputHandler);
      }
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e);
      }
    }
  }

}

exports.default = Vidstreaming;