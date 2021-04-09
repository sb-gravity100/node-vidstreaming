"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printUrls = void 0;

var _loading = _interopRequireDefault(require("./loading"));

var _vidstreaming = _interopRequireDefault(require("../vidstreaming"));

const printUrls = (anime, res, filter) => {
  const vid = new _vidstreaming.default(null, res, filter);

  _loading.default.start();

  _loading.default.message('Printing urls to console...');

  vid.on('error', (err, line) => {
    console.error('Something went wrong', line, '\n', err.message);
    process.exit(1);
  });
  vid.episodes(anime.link).then(data => {
    if (filter.async) {
      vid.on('loaded', (dataLength, length, item) => {
        if (dataLength === length) {
          _loading.default.stop();

          console.log(item.src);
          console.log('Done');
          process.exit(0);
        } else {
          process.stdout.clearLine();

          _loading.default.message(`${dataLength} out of ${length} - Done'`);

          console.log(item.src);
        }
      });
    } else {
      data.each(d => console.log(d.src));
    }
  });
};

exports.printUrls = printUrls;