"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _boxen = _interopRequireDefault(require("boxen"));

var _chalk = _interopRequireDefault(require("chalk"));

var _yargs = _interopRequireDefault(require("yargs"));

var _path = _interopRequireDefault(require("path"));

var _get_urls = require("../utils/get_urls");

var _print_urls = require("../utils/print_urls");

var _middleware = require("../utils/middleware");

var boxenOptions = {
  padding: 1,
  borderColor: 'cyan',
  dimBorder: true
};

var options = _yargs["default"].scriptName('vidstreaming').usage('Usage: $0 -S <name> [...options]').option('S', {
  alias: 'search',
  describe: 'Anime to search for',
  type: 'string',
  demandOption: true
}).option('D', {
  alias: 'download',
  describe: 'Download Anime to directory.\n(eg. "C:/Users/userXXX/Downloads")',
  type: 'string'
}).option('O', {
  alias: 'output',
  describe: 'Output urls to txt.\n(eg. "C:/Users/userXXX/Downloads/jujutsu.txt")',
  type: 'string'
}).option('R', {
  alias: 'resolution',
  describe: 'Output resolution - 360, 480, 720, 1080.\nIf none defaults to original quality.',
  choices: [360, 480, 720, 1080]
}).option('E', {
  alias: 'episodes',
  describe: 'Values separated by commas.',
  array: true
}).option('A', {
  alias: 'async',
  describe: 'If true it will fetch the links one by one and print it.\nOtherwise it will get all the links first and print it.',
  "boolean": true
}).wrap(_yargs["default"].terminalWidth()).argv;

if (options) {
  (0, _middleware.middleware)(options, function (argv) {
    if (argv.O && !argv.D) {
      console.log((0, _boxen["default"])(_chalk["default"].white('Term          -   ' + _chalk["default"].greenBright(argv.search) + '\nOutput File   -   ' + _chalk["default"].yellow(_path["default"].basename(argv.O)) + '\nQuality       -   ' + _chalk["default"].red(argv.R ? argv.R + 'p' : 'Original')), boxenOptions));
      (0, _get_urls.getUrls)(argv.search, argv.output, argv.resolution, {
        episodes: argv.episodes,
        async: argv.async
      });
    }

    if (!argv.O && argv.D) {
      console.log((0, _boxen["default"])('Term           -  ' + _chalk["default"].greenBright(argv.search) + '\nDownload Path  -  ' + _chalk["default"].yellow(_path["default"].basename(argv.D)) + '\nQuality        -  ' + _chalk["default"].red(argv.R ? argv.R + 'p' : 'Original'), boxenOptions));
    }

    if (argv.O && argv.D) {
      console.error('You either choose to output urls to txt or download them');
    }

    if (!argv.O && !argv.D) {
      console.log((0, _boxen["default"])('Term         -  ' + _chalk["default"].greenBright(argv.search) + '\nQuality      -  ' + _chalk["default"].red(argv.R ? argv.R + 'p' : 'Original'), boxenOptions));
      (0, _print_urls.printUrls)(argv.search, argv.resolution, {
        episodes: argv.episodes,
        async: argv.async
      });
    }
  });
}