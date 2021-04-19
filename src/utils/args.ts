import yargs from 'yargs';

export interface Argv {
  $0: string;
  [x: string]: unknown | string;
  _: (string | number)[];
  D: string | undefined;
  download?: string;
  E: (string | number)[] | undefined;
  episodes?: (string | number)[] | undefined;
  O: string | undefined;
  output?: string | undefined;
  R: string | undefined;
  resolution?: string | undefined;
  S: string | undefined;
  search?: string | undefined;
}

// CLI Arguments
export const options: Argv = yargs
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
