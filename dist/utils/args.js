"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = void 0;

var _yargs = _interopRequireDefault(require("yargs"));

const options = _yargs.default.scriptName('vidstreaming').command('Usage: $0 [-S <name> | -L <link>] [...options]', 'If other options are omitted it will copy urls to clipboard.').option('S', {
  alias: 'search',
  describe: 'Anime to search for',
  type: 'string'
}).option('L', {
  alias: 'link',
  describe: 'Link from gogostream.com.\n(eg. "gogostream.com/videos/jujutsu-kaisen-tv-episode-24")',
  type: 'string'
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
  describe: 'If true it will fetch the links one by one and print it.\nOtherwise it will get all the links first and print it.\nNote: Doesn\'t work with default mode.',
  boolean: true
}).wrap(_yargs.default.terminalWidth()).argv;

exports.options = options;