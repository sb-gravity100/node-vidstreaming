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
   .option('M', {
      alias: 'method',
      describe:
         'Must be `0` to download files or `1` to copy urls to txt file...',
      type: 'number',
      default: null,
   })
   .option('O', {
      alias: 'output',
      describe: 'Must be a directory path or path to txt',
      type: 'string',
   })
   .option('E', {
      alias: 'episodes',
      describe:
         'Values separated by commas or spaces. (eg. "- 1 2 3 4" or "1 2 3 4")',
      type: 'string',
      default: null,
   })
   .wrap(yargs.terminalWidth()).argv;
