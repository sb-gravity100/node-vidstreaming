"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clui = _interopRequireDefault(require("clui"));

const LoadingIcons = ['⣾⣷', '⣽⣯', '⣻⣟', '⢿⡿', '⡿⢿', '⣟⣻', '⣯⣽', '⣷⣾'];
const loading = new _clui.default.Spinner('Starting...', LoadingIcons);
var _default = loading;
exports.default = _default;