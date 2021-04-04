"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = _interopRequireDefault(require("lodash"));

var middleware = function middleware(argv, callback) {
  if (argv.E) {
    var newArgs = [];
    argv.E.forEach(function (arg) {
      if (arg.toString().indexOf('-') > -1) {
        var rangeArr = arg.split('-');

        var newRange = _lodash["default"].range(Number(rangeArr[0]), Number(rangeArr[1]) + 1);

        return newArgs.push.apply(newArgs, (0, _toConsumableArray2["default"])(newRange));
      }

      return newArgs.push(arg);
    });
    argv.E = _lodash["default"].uniq(newArgs);
    argv.episodes = _lodash["default"].uniq(newArgs);
  }

  if (argv.O === '') {
    argv.O = "./".concat(argv.S.split(' ').join('_'), ".txt");
    argv.output = "./".concat(argv.S.split(' ').join('_'), ".txt");
    console.log(argv.O);
  }

  if (argv.D === '') {
    return console.error('Specify a directory to download. (eg. "path/to/dir/jujutsu_kaisen")');
  }

  if (argv.S === '') {
    return console.error('Missing: Please specify a search input. (eg. "jujutsu kaisen", "dr stone")');
  }

  callback(argv);
};

exports.middleware = middleware;