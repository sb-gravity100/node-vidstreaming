import inquirer from 'inquirer';
import _ from 'lodash';
import { options } from '../utils/args';
import { getUrls } from '../utils/get_urls';
import { printUrls } from '../utils/print_urls';
import { searchUrls } from '../utils/search_url';
import chalk from 'chalk';
import { middleware } from '../utils/middleware';
import prompts from '../utils/prompts';
import {
  boxxx,
  downloadModeBox,
  outputModeBox,
  printModeBox,
} from '../utils/boxes';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const callSearch = async title => {
  try {
    const list = await searchUrls(title);
    const answers = await inquirer.prompt(prompts(options, list));
    if (answers) {
      if (options.download && options.output) {
        throw new Error(
          'You either choose to output urls to txt or download them'
        );
      }
      console.log(options);
      options.anime = answers.anime;
      middleware(options, argsHandler);
    }
  } catch (e) {
    console.error(chalk.yellow.dim(e.message || 'Something went wrong.'));
  }
};
const argsHandler = argv => {
  // Output urls to file
  if (argv.O) {
    console.log(boxxx(outputModeBox, argv));
    getUrls(argv.anime, argv.output, argv.resolution, {
      episodes: argv.episodes,
      async: argv.async,
    });
  }
  // Download URls
  if (argv.D) {
    console.log(boxxx(downloadModeBox, argv));
    // downloadUrls(argv.search, argv.D, argv.R);
  }

  // Copy urls to clipboard. Note: Async mode doesn't work here...
  if (!argv.O && !argv.D) {
    console.log(boxxx(printModeBox, argv));
    printUrls(argv.anime, argv.resolution, {
      episodes: argv.episodes,
      async: argv.async || false,
    });
  }
};

if (options.S) {
  callSearch(options.search);
}
if (!options.S || options.S === '') {
  inquirer
    .prompt([
      {
        name: 'search',
        message: 'Search Anime |',
      },
    ])
    .then(answers => callSearch(answers.search));
}
