(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropClass = void 0;
    var PropClass = /** @class */ (function () {
        function PropClass(props) {
            this._props = props;
        }
        PropClass.prototype.get = function () {
            return this._props;
        };
        return PropClass;
    }());
    exports.PropClass = PropClass;
});
//# sourceMappingURL=prop_class.js.map