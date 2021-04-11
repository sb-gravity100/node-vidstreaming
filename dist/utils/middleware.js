"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

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
    argv.E = _lodash.default.chain(newArgs).uniq().sortBy().value();
    argv.episodes = _lodash.default.chain(newArgs).uniq().sortBy().value();
  }

  callback(argv);
};

exports.middleware = middleware;