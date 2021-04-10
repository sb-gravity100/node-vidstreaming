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

const outputModeBox = argv => {
  return _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Output         -   ${_chalk.default.yellow(_path.default.basename(argv.O))}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}`);
};

exports.outputModeBox = outputModeBox;

const downloadModeBox = argv => _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Download Path  -   ${_chalk.default.yellow(_path.default.basename(argv.D))}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}`);

exports.downloadModeBox = downloadModeBox;

const printModeBox = argv => _chalk.default.white(`Title          -   ${_chalk.default.greenBright(argv.anime.title)}
Quality        -   ${_chalk.default.red(argv.R ? argv.R + 'p' : 'Original')}`);

exports.printModeBox = printModeBox;

function boxxx(mode = printModeBox, args) {
  return (0, _boxen.default)(mode(args), boxenOptions);
}