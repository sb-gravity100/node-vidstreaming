"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clui = require("clui");

const LoadingIcons = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
const loading = new _clui.Spinner('...', LoadingIcons);
var _default = loading;
exports.default = _default;