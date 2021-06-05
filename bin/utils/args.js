const yargs = require('yargs');

// CLI Arguments
module.exports.options = yargs
   .scriptName('vidstreaming')
   .command(
      'Usage: $0 -S <name> [...options]',
      'If other options are omitted it will copy urls to clipboard.'
   )
   .option('S', {
      alias: 'search',
      describe: 'Anime to search for',
      type: 'string',
      default: null,
   })
   .option('D', {
      alias: 'download',
      describe: 'Download Anime to directory.\n(eg. "some/path/Downloads")',
      type: 'string',
   })
   .option('O', {
      alias: 'output',
      describe: 'Output urls to txt.\n(eg. "some/path/Downloads/jujutsu.txt")',
      type: 'string',
   })
   .option('E', {
      alias: 'episodes',
      describe:
         'Values separated by commas or spaces. (eg. "- 1 2 3 4" or "1 2 3 4")',
      array: true,
   })
   .wrap(yargs.terminalWidth())
   .help().argv;
