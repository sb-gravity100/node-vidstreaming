const boxen = require('boxen');
const path = require('path');
const chalk = require('chalk');
const boxenOptions = {
   padding: 1,
   borderColor: 'cyan',
   dimBorder: true,
};

const episode_list = ep => {
   const temp_arr = [];
   const arr_ep = [];
   if (ep.length === 1) {
      return ep.join(',');
   }
   ep.forEach((e, i) => {
      const prev = ep[i - 1];
      if (i === 0) {
         temp_arr.push(e);
      }
      if (i != 0 && e - prev === 1) {
         temp_arr.push(e);
      } else if (i !== 0 && e - prev > 1) {
         if (temp_arr.length === 1) {
            arr_ep.push(...temp_arr);
         } else {
            arr_ep.push(temp_arr.join('-'));
         }
      }
   });
   return arr_ep.join(',');
};

module.export.outputModeBox = argv => {
   return chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Output         -   ${chalk.yellow(path.basename(argv.O))}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );
};
module.export.outputModeBox = argv =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Download Path  -   ${chalk.yellow(argv.D)}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );
export const printModeBox = argv =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );

module.export.boxx = function (mode = printModeBox, args) {
   return boxen(mode(args), boxenOptions);
};
