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

var _prompts = _interopRequireDefault(require("../utils/prompts"));

var _boxes = require("../utils/boxes");

_inquirer.default.registerPrompt('search-list', require('inquirer-search-list'));

const callSearch = async title => {
  try {
    const list = await (0, _search_url.searchUrls)(title);
    const answers = await _inquirer.default.prompt((0, _prompts.default)(_args.options, list));

    if (answers) {
      if (_args.options.download && _args.options.output) {
        throw new Error('You either choose to output urls to txt or download them');
      }

      console.log(_args.options);
      _args.options.anime = answers.anime;
      (0, _middleware.middleware)(_args.options, argsHandler);
    }
  } catch (e) {
    console.error(_chalk.default.yellow.dim(e.message || 'Something went wrong.'));
  }
};

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
      async: argv.async || false
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