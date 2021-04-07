"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrls = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _loading = _interopRequireDefault(require("./loading"));

var _vidstreaming = require("../vidstreaming");

const getUrls = (name, output, res, filter) => {
  const vid = new _vidstreaming.Vidstreaming(name, res, filter);

  _fs.default.writeFileSync(output, null);

  _loading.default.start();

  const stream = _fs.default.createWriteStream(output, {
    flags: 'a+'
  });

  _loading.default.message('Printing urls to file...');

  vid.on('error', err => {
    console.error(err.code + ':', err.message);

    _fs.default.unlinkSync(output);

    process.exit(1);
  });

  const doneHandler = item => {
    const url = item.src;
    stream.cork();
    stream.write(`${url}\n`);
    process.nextTick(() => stream.uncork());
  };

  vid.episodes(false, data => {
    if (filter.async) {
      vid.on('loaded', (dataLength, length, item) => {
        if (dataLength === length) {
          doneHandler(item);

          _loading.default.stop();

          console.log('Done');
          process.exit(0);
        } else {
          process.stdout.clearLine();

          _loading.default.message(`${dataLength} out of ${length} - Done`);

          doneHandler(item);
        }
      });
    } else {
      data.forEach(d => doneHandler(d));
    }
  });
};

exports.getUrls = getUrls;