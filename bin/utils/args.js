import yargs from 'yargs';

// CLI Arguments
export const options = yargs
  .scriptName('vidstreaming')
  .command(
    'Usage: $0 -S <name> [...options]',
    'If other options are omitted it will copy urls to clipboard.'
  )
  .option('S', {
    alias: 'search',
    describe: 'Anime to search for',
    type: 'string',
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
    type: 'string',
    describe:
      'Decepracated -- Output resolution - [360, 480, 720, 1080].\nIf none defaults to original quality.',
    choices: [],
  })
  .option('E', {
    alias: 'episodes',
    describe: 'Values separated by commas.',
    array: true,
  })
  .wrap(yargs.terminalWidth()).argv;
