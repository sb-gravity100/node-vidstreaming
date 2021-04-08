"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_retry_1 = require("axios-retry");
var cheerio = require("cheerio");
// import * as fs from 'fs';
var path = require("path");
var events_1 = require("events");
var aigle_1 = require("aigle");
var url = 'https://gogo-stream.com';
var instance = axios_1.default.create({
    baseURL: url,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axios_retry_1.default(instance, { retries: 5 });
var Vidstreaming = /** @class */ (function (_super) {
    __extends(Vidstreaming, _super);
    function Vidstreaming(search, res, filter) {
        var _this = _super.call(this) || this;
        _this.search = search;
        _this.res = res;
        _this.filter = filter;
        _this.data = [];
        _this.searchlist = [];
        _this.epNum = 0;
        return _this;
    }
    Vidstreaming.prototype.term = function (term, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var result, anime, $, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, instance.get('/ajax-search.html', {
                                params: {
                                    keyword: term,
                                },
                            })];
                    case 1:
                        anime = _a.sent();
                        if (anime.data.content === '' || !anime.data.content) {
                            throw {
                                message: 'No anime data found',
                                code: 'ANINOTFOUND',
                                name: 'Error',
                            };
                        }
                        $ = cheerio.load(anime.data.content);
                        $('ul a').each(function (i, e) {
                            _this.searchlist.push({
                                title: e.firstChild.data,
                                link: e.attribs.href,
                                eps: Number(e.attribs.href.split('-').pop()),
                            });
                            return i;
                        });
                        result = this.searchlist;
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        this.emit('error', err_1, 'error1');
                        return [3 /*break*/, 4];
                    case 3:
                        if (cb)
                            cb(result);
                        return [2 /*return*/, result];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Vidstreaming.prototype.episodes = function (a, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var result, epData, anime, $, link, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, 7, 8]);
                        epData = void 0;
                        if (!!a) return [3 /*break*/, 3];
                        return [4 /*yield*/, instance.get('/ajax-search.html', {
                                params: {
                                    keyword: this.search,
                                },
                            })];
                    case 1:
                        anime = _a.sent();
                        if (anime.data.content === '' || !anime.data.content) {
                            throw {
                                message: 'No anime data found',
                                code: 'ANINOTFOUND',
                                name: 'Error',
                            };
                        }
                        $ = cheerio.load(anime.data.content);
                        link = $('ul a')[0].attribs.href;
                        return [4 /*yield*/, this.getList(link)];
                    case 2:
                        epData = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.getList(a)];
                    case 4:
                        epData = _a.sent();
                        _a.label = 5;
                    case 5:
                        this.emit('ready', epData);
                        result = epData;
                        return [3 /*break*/, 8];
                    case 6:
                        e_1 = _a.sent();
                        this.emit('error', e_1, 'error2');
                        return [3 /*break*/, 8];
                    case 7:
                        if (cb)
                            cb(result);
                        return [2 /*return*/, result];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Vidstreaming.prototype.getList = function (link, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var results, newHref, data, $, list, href_1, asynciterator, epilist_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, 8, 9]);
                        return [4 /*yield*/, instance.get(link)];
                    case 1:
                        data = (_a.sent()).data;
                        $ = cheerio.load(data);
                        list = $('.listing.items.lists .video-block a');
                        href_1 = [];
                        list.each(function (_i, e) { return href_1.push(e.attribs.href); });
                        this.epNum = href_1.length;
                        asynciterator = function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var data, $, url, id, title, src, srcUrl, filename, ext, ep, animeData;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, instance.get(item)];
                                    case 1:
                                        data = (_a.sent()).data;
                                        $ = cheerio.load(data);
                                        url = new URL('https:' + $('.play-video iframe')[0].attribs.src);
                                        id = url.searchParams.get('id');
                                        title = $('.video-info-left h1')[0].children[0].data;
                                        return [4 /*yield*/, this.getEpisodes(id)];
                                    case 2:
                                        src = _a.sent();
                                        srcUrl = new URL(src).pathname;
                                        filename = path.basename(srcUrl);
                                        ext = path.extname(srcUrl);
                                        ep = Number(path.basename(item).split('-').pop());
                                        animeData = {
                                            filename: filename,
                                            ep: ep,
                                            ext: ext,
                                            id: id,
                                            title: title,
                                            src: src,
                                        };
                                        this.data.push(animeData);
                                        this.filter &&
                                            this.filter.async &&
                                            this.emit('loaded', this.data.length, this.epNum, animeData);
                                        return [2 /*return*/, animeData];
                                }
                            });
                        }); };
                        if (!this.filter) return [3 /*break*/, 4];
                        if (!this.filter.episodes) return [3 /*break*/, 3];
                        epilist_1 = this.filter.episodes;
                        return [4 /*yield*/, aigle_1.Aigle.resolve(href_1)
                                .filter(function (ref) { return epilist_1.includes(Number(ref.split('-').pop())); })
                                .map(asynciterator)];
                    case 2:
                        newHref = _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, aigle_1.Aigle.resolve(href_1)
                            .map(asynciterator)];
                    case 5:
                        newHref = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        err_2 = _a.sent();
                        // console.error('Something went wrong - 98\n', err.message);
                        this.emit('error', err_2, 'error3');
                        return [3 /*break*/, 9];
                    case 8:
                        results = newHref.sort(function (a, b) { return a.ep - b.ep; });
                        if (cb)
                            cb(results);
                        return [2 /*return*/, results];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Vidstreaming.prototype.getEpisodes = function (id, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var results, res_1, data, resList_1, $, anime, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.res) return [3 /*break*/, 2];
                        res_1 = this.res;
                        return [4 /*yield*/, instance.get('/download', {
                                params: {
                                    id: id,
                                },
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        resList_1 = [];
                        $ = cheerio.load(data);
                        $('.mirror_link .dowload a').each(function (_i, e) {
                            return resList_1.push(e.attribs.href);
                        });
                        results = resList_1.filter(function (i) { return i.toString().search(res_1) > -1; })[0];
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, instance.get('/ajax.php', {
                            params: {
                                id: id,
                            },
                        })];
                    case 3:
                        anime = _a.sent();
                        results = anime.data.source.shift().file;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        // console.error('Something went wrong - 128\n', e.message);
                        this.emit('error', err_3, 'getEpisodes');
                        return [3 /*break*/, 6];
                    case 6:
                        if (cb)
                            cb(results);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return Vidstreaming;
}(events_1.EventEmitter));
exports.default = Vidstreaming;
