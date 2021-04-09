"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

const middleware = (argv, callback) => {
  if (argv.D === '') {
    return console.error('Specify a directory to download. (eg. "path/to/dir/jujutsu_kaisen")');
  }

  if (argv.S === '') {
    return console.error('Missing: Please specify a search input. (eg. "jujutsu kaisen", "dr stone")');
  }

  if (argv.download && argv.output) {
    throw new Error('You either choose to output urls to txt or download them');
  }

  if (argv.E) {
    const newArgs = [];
    argv.E.forEach(arg => {
      if (arg.toString().indexOf('-') > -1) {
        const rangeArr = arg.split('-');

        const newRange = _lodash.default.range(Number(rangeArr[0]), Number(rangeArr[1]) + 1);

        return newArgs.push(...newRange);
      }

      return newArgs.push(arg);
    });
    argv.E = _lodash.default.uniq(newArgs);
    argv.episodes = _lodash.default.uniq(newArgs);
  }

  if (argv.O === '') {
    const newPath = `${argv.S.split(' ').join('_')}.txt`;
    argv.O = _path.default.join(process.cwd(), newPath);
    argv.output = _path.default.join(process.cwd(), newPath);
  }

  if (argv.O !== '' && !_path.default.isAbsolute(argv.O)) {
    argv.O = _path.default.join(process.cwd(), argv.O);
    argv.output = _path.default.join(process.cwd(), argv.O);
  }

  if (!_path.default.isAbsolute(argv.D)) {
    argv.D = _path.default.join(process.cwd(), argv.D);
    argv.download = _path.default.join(process.cwd(), argv.D);
  }

  callback(argv);
};

exports.middleware = middleware;