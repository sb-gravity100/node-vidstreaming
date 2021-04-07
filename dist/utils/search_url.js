"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchUrls = void 0;

var _vidstreaming = _interopRequireDefault(require("../vidstreaming"));

const searchUrls = async search => {
  const vid = new _vidstreaming.default();
  vid.on('error', err => {
    if (err.code === 'ANINOTFOUND') {
      console.error(err.message);
    } else {
      console.log('Something went wrong. Check your internet connection');
    }

    process.exit(1);
  });
  return await vid.term(search);
};

exports.searchUrls = searchUrls;