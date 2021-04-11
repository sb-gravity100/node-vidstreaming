"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosRetry = _interopRequireDefault(require("axios-retry"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

var _url = require("url");

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

      const $ = _cheerio.default.load(anime.data.content);

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

      const $ = _cheerio.default.load(data);

      const list = $('.listing.items.lists .video-block a');
      const href = [];
      list.each((_i, e) => href.push(e.attribs.href));

      const asynciterator = async (item) => {
        const anime = await instance.get(item);

        const $ = _cheerio.default.load(anime.data);

        const url = new _url.URL('https:' + $('.play-video iframe')[0].attribs.src);
        const id = url.searchParams.get('id');
        const title = $('.video-info-left h1')[0].children[0].data;
        const src = await this._getEpisodes(id);
        const srcUrl = new _url.URL(src).pathname;

        const filename = _path2.default.basename(srcUrl);

        const ext = _path2.default.extname(srcUrl);

        const ep = Number(_path2.default.basename(item).split('-').pop());
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
        epNum = href.filter(ref => epilist.includes(Number(ref.split('-').pop()))).length;
        newHref = await _aigle.Aigle.resolve(href).filter(ref => epilist.includes(Number(ref.split('-').pop()))).map(asynciterator);
      } else {
        epNum = href.length;
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

      if (cb) {
        cb(results);
      } else {
        return results;
      }
    }
  }

  async _getEpisodes(id, cb) {
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

        const $ = _cheerio.default.load(data);

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

  _deletePath(_path, _files) {
    if (_files.length < 1) {
      return;
    }

    _files.forEach(file => {
      _fs.default.unlink(_path2.default.join(_path, file), err => {
        if (err.code === 'ENOENT') {
          console.error('No file present. Exiting...');
          return;
        }

        if (err) this.emit('error', err);
        return;
      });
    });
  }

  async download(output, list, cb) {
    try {
      const downloadHandler = async (data) => {
        let i = 0;
        let filenames = [];

        _fs.default.access(output, _fs.default.constants.F_OK, err => {
          if (err) {
            _fs.default.mkdirSync(output);
          }
        });

        const queue = async () => {
          try {
            const anime = await _axios.default.get(data[i].src, {
              responseType: 'stream'
            });
            const filename = `EP.${data[i].ep}${this.res ? '.' + this.res + 'p' : ''}${data[i].ext}`;

            const filepath = _path2.default.join(output, filename);

            filenames.push(filename);
            const data_length = anime.headers['content-length'];

            const human_total = require('pretty-bytes')(Number(data_length));

            this.emit('queue', {
              cur: i,
              total: data.length
            }, filename, {
              length: data_length,
              human: human_total
            });
            const source = anime.data;

            const stream = _fs.default.createWriteStream(filepath);

            stream.on('finish', () => {
              if (i === data.length - 1) {
                this.emit('done');
              } else {
                i++;
                queue();
              }
            });
            source.on('error', err => {
              console.log(err.message || 'Something went wrong.', 'Deleting files...');
              i = 0;

              this._deletePath(output, filenames);
            });
            stream.on('error', err => {
              console.log(err.message || 'Something went wrong.', 'Deleting files...');

              this._deletePath(output, filenames);
            });
            source.on('data', chunk => {
              this.emit('download', chunk, stream.bytesWritten, filename);
            });
            source.on('end', () => {
              stream.end();
            });
            source.pipe(stream);
          } catch (e) {
            throw e;
          }
        };

        await queue();
      };

      downloadHandler(list);
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e);
      }
    }

    if (cb) cb();
  }

  async writeTo(output, list, cb) {
    try {
      _fs.default.writeFileSync(output, '');

      const stream = _fs.default.createWriteStream(output, {
        flags: 'a+'
      });

      const outputHandler = data => {
        const data_string = data.map(d => d.src).join('\n');
        this.emit('write');
        stream.end(data_string);
      };

      if (list) {
        outputHandler(list);
      } else {
        this.on('ready', data => outputHandler(data));
      }
    } catch (e) {
      if (this.filter && this.filter.catch) {
        throw e;
      } else {
        this.emit('error', e);
      }
    }

    if (cb) cb();
  }

}

exports.default = Vidstreaming;