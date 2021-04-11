import inquirer from 'inquirer';
import _ from 'lodash';
import { options } from './utils/args';
import chalk from 'chalk';
import { middleware, AnimeOptions } from './utils/middleware';
import prompts from './utils/prompts';
import { searchUrls, writeUrls, clipboardUrls, downloadUrls } from './utils/url_utils';
import {
  boxxx,
  downloadModeBox,
  outputModeBox,
  printModeBox,
} from './utils/boxes';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const callSearch = async (title: string) => {
  try {
    const list = await searchUrls(title);
    const answers = await inquirer.prompt(prompts(options, list));
    options.anime = answers.anime;
    if (!options.R) {
      options.R = answers.res;
      options.resolution = answers.res;
    }
    if (!options.D) {
      options.D = answers.download;
      options.download = answers.download;
    }
    if (!options.O) {
      options.O = answers.output;
      options.output = answers.output;
    }
    middleware(options, argsHandler);
  } catch (e) {
    console.error(chalk.yellow.dim(e.message || 'Something went wrong.'));
  }
};
const argsHandler = (argv: AnimeOptions) => {
  // Output urls to file
  if (argv.O) {
    console.log(boxxx(outputModeBox, argv));
    writeUrls(argv.anime, argv.output, argv.resolution, {
      episodes: argv.episodes,
    });
  }
  // Download URls
  if (argv.D) {
    console.log(boxxx(downloadModeBox, argv));
    downloadUrls(argv.anime, argv.download, argv.resolution, {
      episodes: argv.episodes
    });
  }

  // Copy urls to clipboard. Note: Async mode doesn't work here...
  if (!argv.O && !argv.D) {
    console.log(boxxx(printModeBox, argv));
    clipboardUrls(argv.anime, argv.resolution, {
      episodes: argv.episodes,
    });
  }
};

if (options.S) {
  callSearch(options.search);
}
if (!options.search || options.search === '') {
  inquirer
    .prompt([
      {
        name: 'search',
        message: 'Search Anime |',
      },
    ])
    .then((answers: any) => callSearch(answers.search));
}
