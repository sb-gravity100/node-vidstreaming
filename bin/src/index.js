const { Vidstreaming } = require('../../dist/index');
const fs = require('fs');
const path = require('path');
const { Spinner } = require('clui');
const boxen = require('boxen');
const chalk = require('chalk');
const LoadingIcons = require('../../utils/load_icons');
const loading = new Spinner('...', LoadingIcons);
const boxenOptions = {
  padding: 1,
  borderColor: 'cyan',
  borderStyle: 'classic',
  dimBorder: true,
};

// This wil print the urls to the specified file
const getUrls = (name, output, res) => {
  // Initialize everything
  const vid = new Vidstreaming(name, res);
  fs.writeFileSync(output, null);
  loading.start();
  const stream = fs.createWriteStream(output, { flags: 'a+' });
  loading.message('Printing urls to file...');

  // Handler to be invoked when loaded
  const doneHandler = item => {
    const url = item.src;
    stream.cork();
    stream.write(`${url}\n`);
    process.nextTick(() => stream.uncork());
  };
  // Loaded listener
  vid.on('loaded', (dataLength, length, item) => {
    if (dataLength === length) {
      doneHandler(item);
      loading.stop();
      console.log('Done');
      process.exit(0);
    } else {
      process.stdout.clearLine();
      loading.message(dataLength + ' out of ' + length + ' - Done\n\n');
      doneHandler(item);
    }
  });
};

const logUrls = (name, res) => {
  const vid = new Vidstreaming(name, res);
  loading.start();
  loading.message('Printing urls to console...\n\n');

  // Loaded listener
  vid.on('loaded', (dataLength, length, item) => {
    if (dataLength === length) {
      loading.stop();
      console.log('Done');
      process.exit(0);
    } else {
      process.stdout.clearLine();
      loading.message(dataLength + ' out of ' + length + ' - Done\n\n');
      console.log(item.src)
    }
  });
};

// CLI Arguments
require('yargs')
  .scriptName('vidstreaming')
  .command(
    'search [name]',
    'Search for anime',
    yargs => {
      yargs.positional('name', {
        describe: 'name or string to search for',
        type: 'string',
        demand: true,
      });
    },
    argv => {
      if (argv.name) {
        if (argv.O && !argv.D) {
          console.log(
            boxen(
              'Term          -   ' +
                chalk.greenBright(argv.name) +
                '\nOutput File   -   ' +
                chalk.yellow(path.basename(argv.O)) +
                '\nQuality       -   ' +
                chalk.red(argv.R + 'p' || 'Original'),
              boxenOptions
            )
          );
          getUrls(
            argv.name,
            argv.O || `./${argv.name.split(' ').join('-')}.txt`,
            argv.R
          );
        }
        if (!argv.O && argv.D) {
          boxen(
            'Term           -  ' +
              argv.name +
              '\nDownload Path  -  ' +
              argv.D +
              '\nQuality        -  ' +
              argv.R || 'Original',
            boxenOptions
          );
          // downloadUrls(argv.name, argv.D, argv.R);
        }
        if (argv.O && argv.D) {
          console.error(
            'You either choose to output urls to txt or download them'
          );
        }
        if (!argv.O && !argv.D) {
          boxen(
            'Term         -  ' + argv.name + 'Quality      -  ' + argv.R ||
              'Original',
            boxenOptions
          );
          logUrls();
        }
      }
    }
  )
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
  .help().argv;
