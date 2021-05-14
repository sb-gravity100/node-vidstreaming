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
        define(["require", "exports", "./prop_class"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MirrorType = void 0;
    var prop_class_1 = require("./prop_class");
    var MirrorType = /** @class */ (function (_super) {
        __extends(MirrorType, _super);
        function MirrorType(props) {
            return _super.call(this, props) || this;
        }
        Object.defineProperty(MirrorType.prototype, "code", {
            get: function () {
                return this._props.code;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MirrorType.prototype, "name", {
            get: function () {
                return this._props.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MirrorType.prototype, "links", {
            get: function () {
                return this._props.links;
            },
            enumerable: false,
            configurable: true
        });
        return MirrorType;
    }(prop_class_1.PropClass));
    exports.MirrorType = MirrorType;
});
//# sourceMappingURL=mirrors.js.map