"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrls = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _loading = _interopRequireDefault(require("./loading"));

var _vidstreaming = require("../vidstreaming");

var getUrls = function getUrls(name, output, res, filter) {
  var vid = new _vidstreaming.Vidstreaming(name, res, filter);

  _fs["default"].writeFileSync(output, null);

  _loading["default"].start();

  var stream = _fs["default"].createWriteStream(output, {
    flags: 'a+'
  });

  _loading["default"].message('Printing urls to file...');

  var doneHandler = function doneHandler(item) {
    var url = item.src;
    stream.cork();
    stream.write("".concat(url, "\n"));
    process.nextTick(function () {
      return stream.uncork();
    });
  };

  if (filter.async) {
    vid.on('loaded', function (dataLength, length, item) {
      if (dataLength === length) {
        doneHandler(item);

        _loading["default"].stop();

        console.log('Done');
        process.exit(0);
      } else {
        process.stdout.clearLine();

        _loading["default"].message("".concat(dataLength, " out of ").concat(length, " - Done"));

        doneHandler(item);
      }
    });
  } else {
    vid.episodes().then(function (data) {
      return data.forEach(function (d) {
        return doneHandler(d);
      });
    });
  }

  vid.on('error', function (err, line) {
    console.error('Something went wrong', line, '\n', err.message);

    _fs["default"].unlinkSync(output);

    process.exit(1);
  });
};

exports.getUrls = getUrls;