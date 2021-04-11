import boxen, { Options as boxOptions } from 'boxen';
import path from 'path';
import chalk from 'chalk';
const boxenOptions: boxOptions = {
   padding: 1,
   borderColor: 'cyan',
   dimBorder: true,
};

const episode_list = (ep: Array<number>): string => {
   const temp_arr: Array<number> = [];
   const arr_ep: Array<number | string> = [];
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

export const outputModeBox = (argv: any): string => {
   return chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Output         -   ${chalk.yellow(path.basename(argv.O))}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );
};
export const downloadModeBox = (argv: any): string =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Download Path  -   ${chalk.yellow(argv.D)}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );
export const printModeBox = (argv: any): string =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}
Episodes       -   ${chalk.cyan(argv.E ? episode_list(argv.E) : 'All')}`
   );

export function boxxx(mode = printModeBox, args) {
   return boxen(mode(args), boxenOptions);
}
