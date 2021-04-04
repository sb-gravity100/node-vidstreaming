"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vidstreaming = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = _interopRequireDefault(require("lodash"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosRetry = _interopRequireDefault(require("axios-retry"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _events = require("events");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var url = 'https://gogo-stream.com';

var instance = _axios["default"].create({
  baseURL: url,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

(0, _axiosRetry["default"])(instance, {
  retries: 5
});

var Vidstreaming = function (_EventEmitter) {
  (0, _inherits2["default"])(Vidstreaming, _EventEmitter);

  var _super = _createSuper(Vidstreaming);

  function Vidstreaming(search, res, filter) {
    var _this;

    (0, _classCallCheck2["default"])(this, Vidstreaming);
    _this = _super.call(this, {
      captureRejections: true
    });
    _this.search = search;
    _this.res = res;
    _this.filter = filter;
    _this.data = _lodash["default"].chain([]);

    if (_this.filter.async) {
      console.log('  So you have chosen async');

      _this.episodes();
    }

    return _this;
  }

  (0, _createClass2["default"])(Vidstreaming, [{
    key: "search",
    value: function () {
      var _search = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(term, cb) {
        var anime, $, searchlist;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return instance.get('/ajax-search.html', {
                  params: {
                    keyword: term
                  }
                });

              case 3:
                anime = _context.sent;
                $ = _cheerio["default"].load(anime.data.content);
                searchlist = [];
                $('ul a').each(function (i, e) {
                  return searchlist.push({
                    title: e.firstChild.data,
                    link: e.attribs.href
                  });
                });
                cb(null, searchlist);
                return _context.abrupt("return", searchlist);

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                cb(_context.t0, null);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11]]);
      }));

      function search(_x, _x2) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
  }, {
    key: "episodes",
    value: function () {
      var _episodes = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(cb) {
        var anime, $, link, _epData;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return instance.get('/ajax-search.html', {
                  params: {
                    keyword: this.search
                  }
                });

              case 3:
                anime = _context2.sent;

                if (anime.data.content === '' || !anime.data.content) {
                  process.stdout.clearLine();
                  process.stdout.write('No anime found');
                  process.exit();
                }

                $ = _cheerio["default"].load(anime.data.content);
                link = $('ul a')[0].attribs.href;
                _context2.next = 9;
                return this.getList(link);

              case 9:
                _epData = _context2.sent;
                this.emit('ready', _epData);
                console.log('list taken');

                if (cb) {
                  cb(null, _epData);
                }

                _context2.next = 19;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](0);
                this.emit('error', _context2.t0, 72);

                if (cb) {
                  cb(null, epData);
                }

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 15]]);
      }));

      function episodes(_x3) {
        return _episodes.apply(this, arguments);
      }

      return episodes;
    }()
  }, {
    key: "getList",
    value: function () {
      var _getList = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(link) {
        var _this2 = this;

        var _yield$instance$get, data, $, list, epilist, href, asyncGetEpisodes, newHref;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return instance.get(link);

              case 3:
                _yield$instance$get = _context4.sent;
                data = _yield$instance$get.data;
                $ = _cheerio["default"].load(data);
                list = $('.listing.items.lists .video-block a');
                epilist = _lodash["default"].chain(this.filter.episodes);
                href = _lodash["default"].chain([]);
                list.each(function (i, e) {
                  return href.push(e.attribs.href);
                });
                console.log('pushed');
                this.epNum = href.size();

                asyncGetEpisodes = function () {
                  var _ref = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(item) {
                    var _yield$instance$get2, _data, _$, _url, id, title, src, filename, ext, ep;

                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.prev = 0;
                            console.log('yojooo');
                            _context3.next = 4;
                            return instance.get(item);

                          case 4:
                            _yield$instance$get2 = _context3.sent;
                            _data = _yield$instance$get2.data;
                            _$ = _cheerio["default"].load(_data);
                            _url = new URL('https:' + _$('.play-video iframe')[0].attribs.src);
                            id = _url.searchParams.get('id');
                            title = _$('.video-info-left h1')[0].children[0].data;
                            _context3.next = 12;
                            return _this2.getEpisodes(id);

                          case 12:
                            src = _context3.sent;
                            filename = _path["default"].basename(new URL(src).pathname);
                            ext = _path["default"].extname(new URL(src).pathname);
                            ep = Number(_path["default"].basename(item).split('-').pop());

                            _this2.data.push({
                              filename: filename,
                              ep: ep,
                              ext: ext,
                              id: id,
                              title: title,
                              src: src
                            });

                            _this2.emit('loaded', _this2.data.size(), _this2.epNum, {
                              filename: filename,
                              ep: ep,
                              ext: ext,
                              id: id,
                              title: title,
                              src: src
                            });

                            _context3.next = 23;
                            break;

                          case 20:
                            _context3.prev = 20;
                            _context3.t0 = _context3["catch"](0);

                            _this2.emit('error', e, 102);

                          case 23:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, null, [[0, 20]]);
                  }));

                  return function asyncGetEpisodes(_x5) {
                    return _ref.apply(this, arguments);
                  };
                }();

                if (this.filter.episodes) {
                  newHref = href.filter(function (item) {
                    epilist.includes(Number(_path["default"].basename(item.split('-').pop())));
                    console.log('filtered');
                  });
                  newHref.sortBy(function (i) {
                    return Number(_path["default"].basename(i.split('-').pop()));
                  }).value().forEach(function (i) {
                    return asyncGetEpisodes(i);
                  });
                } else {
                  console.log('Not filtered');
                  href.sortBy(function (i) {
                    return Number(_path["default"].basename(i.split('-').pop()));
                  }).value().forEach(function (i) {
                    return asyncGetEpisodes(i);
                  });
                }

                _context4.next = 19;
                break;

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4["catch"](0);
                this.emit('error', _context4.t0, 106);

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 16]]);
      }));

      function getList(_x4) {
        return _getList.apply(this, arguments);
      }

      return getList;
    }()
  }, {
    key: "getEpisodes",
    value: function () {
      var _getEpisodes = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee5(id) {
        var res, _yield$instance$get3, data, $, resList;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                res = this.res;
                _context5.next = 4;
                return instance.get('/download', {
                  params: {
                    id: id
                  }
                });

              case 4:
                _yield$instance$get3 = _context5.sent;
                data = _yield$instance$get3.data;
                $ = _cheerio["default"].load(data);
                resList = _lodash["default"].chain([]);
                $('.mirror_link .dowload a').each(function (i, e) {
                  return resList.push(e.attribs.href);
                });
                return _context5.abrupt("return", resList.filter(function (i) {
                  return i.search(res || /HDP/g) > -1;
                }).head());

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                this.emit('error', _context5.t0, 128);

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 12]]);
      }));

      function getEpisodes(_x6) {
        return _getEpisodes.apply(this, arguments);
      }

      return getEpisodes;
    }()
  }, {
    key: "download",
    value: function download(format, dest) {}
  }, {
    key: "writeTo",
    value: function writeTo(output, cb) {
      _fs["default"].writeFileSync(output, null);

      var stream = _fs["default"].createWriteStream(output, {
        flags: 'a+'
      });

      var doneHandler = function doneHandler(item) {
        var url = item.src;
        stream.cork();
        stream.write("".concat(url, "\n"));
        process.nextTick(function () {
          return stream.uncork();
        });
      };

      if (filter.async) {
        this.on('loaded', function (dataLength, length, ep) {
          if (dataLength === length) {
            doneHandler(ep);
            sortUrls();
            process.exit(0);
          } else {
            doneHandler(ep);
          }
        });
      } else {
        vid.episodes().then(function (data) {
          data.forEach(function (d) {
            return doneHandler(d);
          });
          cb(data);
        });
      }

      vid.on('error', function (err, line) {
        cb(err);

        _fs["default"].unlinkSync(output);

        process.exit(1);
      });
    }
  }]);
  return Vidstreaming;
}(_events.EventEmitter);

exports.Vidstreaming = Vidstreaming;