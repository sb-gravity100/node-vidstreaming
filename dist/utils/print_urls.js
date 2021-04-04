"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printUrls = void 0;

var _loading = _interopRequireDefault(require("./loading"));

var _vidstreaming = require("../vidstreaming");

var printUrls = function printUrls(name, res, filter) {
  var vid = new _vidstreaming.Vidstreaming(name, res, filter);

  _loading["default"].start();

  _loading["default"].message('Printing urls to console...');

  if (filter.async) {
    vid.on('loaded', function (dataLength, length, item) {
      if (dataLength === length) {
        _loading["default"].stop();

        console.log(item.src);
        console.log('Done');
        process.exit(0);
      } else {
        process.stdout.clearLine();

        _loading["default"].message("".concat(dataLength, " out of ").concat(length, " - Done'"));

        console.log(item.src);
      }
    });
  } else {
    vid.episodes().then(function (data) {
      data.each(function (d) {
        return console.log(d.src);
      });
    });
  }

  vid.on('error', function (err, line) {
    console.error('Something went wrong', line, '\n', err.message);
    process.exit(1);
  });
};

exports.printUrls = printUrls;