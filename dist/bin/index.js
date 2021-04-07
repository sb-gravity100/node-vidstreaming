"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _lodash = _interopRequireDefault(require("lodash"));

var _args = require("../utils/args");

var _get_urls = require("../utils/get_urls");

var _print_urls = require("../utils/print_urls");

var _search_url = require("../utils/search_url");

var _chalk = _interopRequireDefault(require("chalk"));

var _middleware = require("../utils/middleware");

var _boxes = require("../utils/boxes");

_inquirer.default.registerPrompt('search-list', require('inquirer-search-list'));

const callSearch = title => (0, _search_url.searchUrls)(title).then(list => _inquirer.default.prompt([{
  type: 'search-list',
  name: 'anime',
  message: 'Search results:',
  choices: list.map(a => ({
    name: a.title,
    value: a
  })),
  default: 1
}, {
  type: 'input',
  name: 'download',
  message: 'Download path:',
  default: false,
  when: !_args.options.D && !_args.options.O,
  transformer: input => {
    if (!input || input === '') {
      return false;
    }

    _args.options.D = input;
    _args.options.download = input;
    return input;
  }
}, {
  type: 'input',
  name: 'output',
  message: 'Output file:',
  default: false,
  when: !_args.options.D && !_args.options.O,
  validate: input => {
    if (input && input.search(/\.txt$/i) === -1) {
      return `File must be a text - (.txt) file.`;
    }

    return true;
  },
  transformer: input => {
    if (!input || input === '') {
      return false;
    }

    _args.options.O = input;
    _args.options.output = input;
    return input;
  }
}]).then(answers => {
  if (_args.options.download && _args.options.output) {
    throw new Error('You either choose to output urls to txt or download them');
  }

  console.log(_args.options);
  _args.options.anime = answers.anime;
  (0, _middleware.middleware)(_args.options, argsHandler);
}).catch(e => console.error(_chalk.default.yellow.dim(e.message || 'Something went wrong.'))));

const argsHandler = argv => {
  if (argv.O) {
    console.log((0, _boxes.boxxx)(_boxes.outputModeBox, argv));
    (0, _get_urls.getUrls)(argv.anime, argv.output, argv.resolution, {
      episodes: argv.episodes,
      async: argv.async
    });
  }

  if (argv.D) {
    console.log((0, _boxes.boxxx)(_boxes.downloadModeBox, argv));
  }

  if (!argv.O && !argv.D) {
    console.log((0, _boxes.boxxx)(_boxes.printModeBox, argv));
    (0, _print_urls.printUrls)(argv.anime, argv.resolution, {
      episodes: argv.episodes,
      async: argv.async
    });
  }
};

if (_args.options.S) {
  callSearch(_args.options.search);
}

if (!_args.options.S || _args.options.S === '') {
  _inquirer.default.prompt([{
    name: 'search',
    message: 'Search Anime |'
  }]).then(answers => callSearch(answers.search));
}