"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _args = require("../utils/args");

var _chalk = _interopRequireDefault(require("chalk"));

var _middleware = require("../utils/middleware");

var _prompts = _interopRequireDefault(require("../utils/prompts"));

var _url_utils = require("../utils/url_utils");

var _boxes = require("../utils/boxes");

_inquirer.default.registerPrompt('search-list', require('inquirer-search-list'));

const callSearch = async title => {
  try {
    const list = await (0, _url_utils.searchUrls)(title);
    const answers = await _inquirer.default.prompt((0, _prompts.default)(_args.options, list));
    _args.options.anime = answers.anime;

    if (!_args.options.R) {
      _args.options.R = answers.res;
      _args.options.resolution = answers.res;
    }

    if (!_args.options.D) {
      _args.options.D = answers.download;
      _args.options.download = answers.download;
    }

    if (!_args.options.O) {
      _args.options.O = answers.output;
      _args.options.output = answers.output;
    }

    (0, _middleware.middleware)(_args.options, argsHandler);
  } catch (e) {
    console.error(_chalk.default.yellow.dim(e.message || 'Something went wrong.'));
  }
};

const argsHandler = argv => {
  if (argv.O) {
    console.log((0, _boxes.boxxx)(_boxes.outputModeBox, argv));
    (0, _url_utils.writeUrls)(argv.anime, argv.output, argv.resolution, {
      episodes: argv.episodes
    });
  }

  if (argv.D) {
    console.log((0, _boxes.boxxx)(_boxes.downloadModeBox, argv));
  }

  if (!argv.O && !argv.D) {
    console.log((0, _boxes.boxxx)(_boxes.printModeBox, argv));
    (0, _url_utils.clipboardUrls)(argv.anime, argv.resolution, {
      episodes: argv.episodes
    });
  }
};

if (_args.options.S) {
  callSearch(_args.options.search);
}

if (!_args.options.search || _args.options.search === '') {
  _inquirer.default.prompt([{
    name: 'search',
    message: 'Search Anime |'
  }]).then(answers => callSearch(answers.search));
}