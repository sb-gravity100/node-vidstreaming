import boxen, { Options as boxOptions } from 'boxen';
import path from 'path';
import chalk from 'chalk';
const boxenOptions: boxOptions = {
   padding: 1,
   borderColor: 'cyan',
   dimBorder: true,
};

export const outputModeBox = (argv: any): string => {
   return chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Output         -   ${chalk.yellow(path.basename(argv.O))}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}`
   );
};
export const downloadModeBox = (argv: any): string =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Download Path  -   ${chalk.yellow(path.basename(argv.D))}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}`
   );
export const printModeBox = (argv: any): string =>
   chalk.white(
      `Title          -   ${chalk.greenBright(argv.anime.title)}
Quality        -   ${chalk.red(argv.R ? argv.R + 'p' : 'Original')}`
   );

export function boxxx(mode = printModeBox, args) {
   return boxen(mode(args), boxenOptions);
}
