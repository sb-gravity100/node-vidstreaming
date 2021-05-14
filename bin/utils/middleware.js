const _ = require('lodash')
const path = require('path')

export const middleware = (argv, callback) => {
   if (argv.D === '') {
      return console.error(
         'Specify a directory to download. (eg. "path/to/dir/jujutsu_kaisen")'
      );
   }
   if (argv.S === '') {
      return console.error(
         'Missing: Please specify a search input. (eg. "jujutsu kaisen", "dr stone")'
      );
   }
   if (argv.download && argv.output) {
      throw new Error(
         'You either choose to output urls to txt or download them'
      );
   }
   if (argv.E) {
      const newArgs = [];
      argv.E.forEach(arg => {
         if (arg.toString().indexOf('-') > -1) {
            const rangeArr = arg.split('-');
            const newRange = _.range(
               Number(rangeArr[0]),
               Number(rangeArr[1]) + 1
            );
            return newArgs.push(...newRange);
         }
         return newArgs.push(arg);
      });
      argv.E = _.chain(newArgs).uniq().sortBy().value();
      argv.episodes = _.chain(newArgs).uniq().sortBy().value();
   }
   callback(argv);
};
