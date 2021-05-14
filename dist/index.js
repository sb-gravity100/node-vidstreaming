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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-html-parser", "lodash", "./classes/search_result", "aigle", "./axios_instance"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vidstreaming = void 0;
    var node_html_parser_1 = require("node-html-parser");
    var _ = require("lodash");
    var search_result_1 = require("./classes/search_result");
    var aigle_1 = require("aigle");
    var axios_instance_1 = require("./axios_instance");
    /**
     * Main class
     * @example
     * ```javascript
     * const { Vidstreaming } = require('node-vidstreaming')
     * var Anime = new Vidstreaming()
     * ```
     */
    var Vidstreaming = /** @class */ (function () {
        function Vidstreaming() {
        }
        Vidstreaming.prototype.term = function (term) {
            return __awaiter(this, void 0, void 0, function () {
                var anime, document_1, _arr, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, axios_instance_1.instance.get('/ajax-search.html', {
                                    params: {
                                        keyword: term,
                                    },
                                })];
                        case 1:
                            anime = _a.sent();
                            if (anime.data.content === '' || !anime.data.content) {
                                throw {
                                    message: 'No anime data found',
                                    code: 'NOTFOUND',
                                };
                            }
                            document_1 = node_html_parser_1.parse(anime.data.content);
                            return [4 /*yield*/, aigle_1.default.resolve(document_1.querySelectorAll('ul a')).map(function (a) { return __awaiter(_this, void 0, void 0, function () {
                                    var href, epNum, episodes;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                href = a.attrs.href.toString();
                                                epNum = Number(href.split('-').pop());
                                                return [4 /*yield*/, this.getEpisodeData(href)];
                                            case 1:
                                                episodes = _a.sent();
                                                return [2 /*return*/, new search_result_1.SearchResult({
                                                        title: a.textContent,
                                                        link: href,
                                                        epNum: epNum,
                                                        episodes: episodes,
                                                    })];
                                        }
                                    });
                                }); })];
                        case 2:
                            _arr = _a.sent();
                            return [2 /*return*/, _arr];
                        case 3:
                            e_1 = _a.sent();
                            if (e_1.isAxiosError) {
                                throw {
                                    name: e_1.name,
                                    code: e_1.code,
                                    status: e_1.status,
                                    message: 'Failed to search anime',
                                };
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Vidstreaming.prototype.getEpisodeData = function (link) {
            return __awaiter(this, void 0, void 0, function () {
                var anime, document, episodes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_instance_1.instance.get(link)];
                        case 1:
                            anime = _a.sent();
                            document = node_html_parser_1.parse(anime.data);
                            return [4 /*yield*/, aigle_1.default.resolve(document.querySelectorAll('.video-info-left ul.listing .video-block a')).map(function (a) { return ({
                                    name: a.querySelector('.name').textContent.trim(),
                                    link: a.attributes.href,
                                    ep: Number(a.attributes.href.split('-').pop()),
                                }); })];
                        case 2:
                            episodes = _a.sent();
                            return [2 /*return*/, _.sortBy(episodes, 'ep')];
                    }
                });
            });
        };
        return Vidstreaming;
    }());
    exports.Vidstreaming = Vidstreaming;
});
//# sourceMappingURL=index.js.map