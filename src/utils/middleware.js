import _ from 'lodash';

export const middleware = (argv, callback) => {
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
      argv.E = _.uniq(newArgs)
      argv.episodes = _.uniq(newArgs);
   }
   if (argv.O === '') {
      argv.O = `./${argv.S}.txt`
      argv.output = `./${argv.S}.txt`;
      console.log(argv.O)
   }
   if (argv.D === '') {
      return console.error('Specify a directory to download. (eg. "path/to/dir/jujutsu_kaisen")');
   }
   if (argv.S === '') {
      return console.error('Missing: Please specify a search input. (eg. "jujutsu kaisen", "dr stone")')
   }
   callback(argv);
};
