"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boxxx = boxxx;
exports.printModeBox = exports.downloadModeBox = exports.outputModeBox = void 0;

var _boxen = _interopRequireDefault(require("boxen"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

const boxenOptions = {
  padding: 1,
  borderColor: 'cyan',
  dimBorder: true
};

const episode_list = ep => {
  const temp_arr = [];
  const arr_ep = [];

  if (ep.length === 1) {
    return ep.join(',');
  }

  ep.forEach((e, i) => {
    const prev = ep[i - 1];

    if (i === 0) {
      temp_arr.push(e);
    }

    if (i != 0 && e - prev === 1) {
      temp_arr.push(e);
    } else if (i !== 0 && e - prev > 1) {
      if (temp_arr.length === 1) {
        arr_ep.push(...temp_arr);
      } else {
        arr_ep.push(temp_arr.join('-'));
      }
    }
  });
  return arr_ep.join(',');
};

const outputModeBox = argv => {
  return _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Output         -   ${_chalk.default.yellow(_path.default.basename(argv.O))}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${_chalk.default.cyan(argv.E ? episode_list(argv.E) : 'All')}`);
};

exports.outputModeBox = outputModeBox;

const downloadModeBox = argv => _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Download Path  -   ${_chalk.default.yellow(argv.D)}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${_chalk.default.cyan(argv.E ? episode_list(argv.E) : 'All')}`);

exports.downloadModeBox = downloadModeBox;

const printModeBox = argv => _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${_chalk.default.cyan(argv.E ? episode_list(argv.E) : 'All')}`);

exports.printModeBox = printModeBox;

function boxxx(mode = printModeBox, args) {
  return (0, _boxen.default)(mode(args), boxenOptions);
}