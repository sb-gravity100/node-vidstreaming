const { Vidstreaming } = require('../dist/index');
const fs = require('fs');
const path = require('path');
const { Spinner } = require('clui');
const boxen = require('boxen');
const chalk = require('chalk');
const LoadingIcons = require('../utils/load_icons');
const loading = new Spinner('...', LoadingIcons);
const boxenOptions = {
  padding: 1,
  borderColor: 'cyan',
  borderStyle: 'classic',
  dimBorder: true,
};

const getUrls = (name, output, res) => {
  const vid = new Vidstreaming(name, res);
  fs.writeFileSync(output, '');
  loading.start();
  const stream = fs.createWriteStream(output, { flags: 'a+' });
  const doneHandler = item => {
    const url = item.src;
    stream.cork();
    stream.write(`
${url}`);
    process.nextTick(() => stream.uncork());
  };
  loading.message('Printing urls to file...\n\n');
  vid.on('loaded', (data, length, item) => {
    if (data === length) {
      doneHandler(item);
      loading.stop();
      console.log('Done');
      process.exit(0);
    } else {
      process.stdout.clearLine();
      loading.message(data + ' out of ' + length + ' - Done\n\n');
      doneHandler(item);
    }
  });
};

require('yargs')
  .scriptName('vidstreaming')
  .usage('$0 <cmd>')
  .command(
    'search [name]',
    'Search for anime',
    yargs => {
      yargs.positional('name', {
        describe: 'name or string to search for',
        type: 'string',
        demandOption: true,
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
          console.log(
            `
  Term          - ${argv.name}
  Download Path - ${argv.D}
  Quality       - ${argv.R || 'Original'}
`
          );
          downloadUrls(argv.name, argv.D, argv.R);
        }
        if (argv.O && argv.D) {
          console.error(
            'You either choose to output urls to txt or download them'
          );
        }
        if (!argv.O && !argv.D) {
          console.log(
            `
  Term        - ${argv.name}
  Quality     - ${argv.R || 'Original'}
`
          );
        }
      }
    }
  )
  .option('D', {
    alias: 'download',
    describe: 'Download Anime to Dir',
  })
  .option('O', {
    alias: 'output',
    describe: 'Output urls to txt',
  })
  .option('R', {
    alias: 'resolution',
    describe:
      'Output resolution - 360, 480, 720, 1080. If none defaults to original quality',
    choices: [360, 480, 720, 1080, 'HDP'],
  })
  .showHelpOnFail(false, 'Specify --help for available options')
  .help().argv;
