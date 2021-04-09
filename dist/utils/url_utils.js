"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchUrls = searchUrls;
exports.writeUrls = writeUrls;

var _loading = _interopRequireDefault(require("./loading"));

var fs = _interopRequireWildcard(require("fs"));

var _vidstreaming = _interopRequireDefault(require("../vidstreaming"));

async function searchUrls(search) {
  const vid = new _vidstreaming.default();
  vid.on('error', err => {
    switch (err.code) {
      case 'ANINOTFOUND':
        console.error(err.message);
        break;

      case 'ENOTFOUND':
        console.log('Something went wrong. Check your internet connection.');
        break;

      default:
        console.log(err.message);
    }

    process.exit(1);
  });
  return await vid.term(search);
}

async function writeUrls(anime, output, res, options) {
  const instance = new _vidstreaming.default(res, options);
  const stream = fs.createWriteStream(output);

  _loading.default.start();

  instance.on('error', err => {
    console.log(err.message);
    process.exit(1);
  });
  instance.on('loaded', (urls, total) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    _loading.default.message(`${urls.length} / ${total}`);
  });
  await instance.episodes(anime.link);
  await instance.writeTo(output);
}