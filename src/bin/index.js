import boxen from 'boxen';
import chalk from 'chalk';
import yargs from 'yargs';
import path from 'path';
import { getUrls } from '../utils/get_urls';
import { printUrls } from '../utils/print_urls';
import { middleware } from '../utils/middleware';

const boxenOptions = {
  padding: 1,
  borderColor: 'cyan',
  dimBorder: true,
};

// CLI Arguments
const options = yargs
  .scriptName('vidstreaming')
  .usage('Usage: $0 -S <name> [...options]')
  .option('S', {
    alias: 'search',
    describe: 'Anime to search for',
    type: 'string',
    demandOption: true,
  })
  .option('D', {
    alias: 'download',

    describe:
      'Download Anime to directory.\n(eg. "C:/Users/userXXX/Downloads")',
    type: 'string',
  })
  .option('O', {
    alias: 'output',
    describe:
      'Output urls to txt.\n(eg. "C:/Users/userXXX/Downloads/jujutsu.txt")',
    type: 'string',
  })
  .option('R', {
    alias: 'resolution',
    describe:
      'Output resolution - 360, 480, 720, 1080.\nIf none defaults to original quality.',
    choices: [360, 480, 720, 1080],
  })
  .option('E', {
    alias: 'episodes',
    describe: 'Values separated by commas.',
    array: true,
  })
  .option('A', {
    alias: 'async',
    describe: 'If true it will fetch the links one by one and print it.\nOtherwise it will get all the links first and print it.',
    boolean: true,
  })
  .wrap(yargs.terminalWidth()).argv;

if (options) {
  middleware(options, argv => {
    if (argv.O && !argv.D) {
      console.log(
        boxen(
          chalk.white(
            'Term          -   ' +
              chalk.greenBright(argv.search) +
              '\nOutput File   -   ' +
              chalk.yellow(path.basename(argv.O)) +
              '\nQuality       -   ' +
              chalk.red(argv.R ? argv.R + 'p': 'Original')
          ),
          boxenOptions
        )
      );
      getUrls(argv.search, argv.output, argv.resolution, {
        episodes: argv.episodes,
        async: argv.async,
      });
    }
    if (!argv.O && argv.D) {
      console.log(
        boxen(
          'Term           -  ' +
            chalk.greenBright(argv.search) +
            '\nDownload Path  -  ' +
            chalk.yellow(path.basename(argv.D)) +
            '\nQuality        -  ' +
            chalk.red(argv.R ? argv.R + 'p': 'Original'),
          boxenOptions
        )
      );
      // downloadUrls(argv.search, argv.D, argv.R);
    }
    if (argv.O && argv.D) {
      console.error('You either choose to output urls to txt or download them');
    }
    if (!argv.O && !argv.D) {
      console.log(
        boxen(
          'Term         -  ' +
            chalk.greenBright(argv.search) +
            '\nQuality      -  ' +
            chalk.red(argv.R ? argv.R + 'p': 'Original'),
          boxenOptions
        )
      );
      printUrls(argv.search, argv.resolution, {
        episodes: argv.episodes,
        async: argv.async,
      });
    }
  });
}
