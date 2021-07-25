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
   })
   .option('M', {
      alias: 'method',
      describe:
         'Must be `1` to download files or `2` to copy urls to txt file...',
      type: 'number',
   })
   .option('O', {
      alias: 'output',
      describe: 'Must be a directory path or path to txt',
      type: 'string',
   })
   .option('E', {
      alias: 'episodes',
      describe: 'Values separated by spaces. (eg. "1 2 3 4" or "R 1 2 3 4")',
      type: 'array',
   })
   .wrap(yargs.terminalWidth());
