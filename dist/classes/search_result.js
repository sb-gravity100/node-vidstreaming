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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./prop_class", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchResult = void 0;
    var prop_class_1 = require("./prop_class");
    var _ = require("lodash");
    var EpisodeData = /** @class */ (function (_super) {
        __extends(EpisodeData, _super);
        function EpisodeData(props) {
            return _super.call(this, props) || this;
        }
        Object.defineProperty(EpisodeData.prototype, "name", {
            get: function () {
                return this._props.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EpisodeData.prototype, "link", {
            get: function () {
                return this._props.link;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EpisodeData.prototype, "ep", {
            get: function () {
                return this._props.ep;
            },
            enumerable: false,
            configurable: true
        });
        return EpisodeData;
    }(prop_class_1.PropClass));
    var SearchResult = /** @class */ (function (_super) {
        __extends(SearchResult, _super);
        function SearchResult(props) {
            var _this = _super.call(this, props) || this;
            _this._episodes = _.map(props.episodes, function (ep) { return new EpisodeData(ep); });
            return _this;
        }
        Object.defineProperty(SearchResult.prototype, "title", {
            get: function () {
                return this._props.title;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SearchResult.prototype, "link", {
            get: function () {
                return this._props.link;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SearchResult.prototype, "epNum", {
            get: function () {
                return this._props.epNum;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SearchResult.prototype, "episodes", {
            get: function () {
                return this._episodes;
            },
            enumerable: false,
            configurable: true
        });
        return SearchResult;
    }(prop_class_1.PropClass));
    exports.SearchResult = SearchResult;
});
//# sourceMappingURL=search_result.js.map