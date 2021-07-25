const chalk = require('chalk');
const inquirer = require('inquirer');
const { initial, method } = require('lodash');
const _ = require('lodash');
const path = require('path');
const { format } = require('util');
const boxen = require('boxen');
const { SearchResult } = require('../../dist/classes/search_result');
const { searchUrls, clipboardUrls, GetEpisodes } = require('./url_utils');
const filterString = require('../../dist/funcs/filter_string');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const METHODS = [
   { name: 'Download Files', value: 1 },
   { name: 'Copy URLs to txt file', value: 2 },
   { name: 'Copy to Clipboard', value: 3 },
];
const PROMPTS = () => ({
   method: {
      type: 'search-list',
      name: 'method',
      default: 3,
      message: 'Choose methods',
      choices: METHODS,
   },
   path: (method, title = '') => ({
      name: 'path',
      message: 'Specify file path',
      default: path.join(process.cwd(), method === 2 ? title + '.txt' : title),
      validate(val) {
         if (!val) {
            return 'Must provide a path';
         }
         if (method === 2) {
            const ext = path.extname(val);
            if (ext !== '.txt') {
               return 'Path must be txt file';
            }
         }
         return true;
      },
      transformer: val => {
         if (method === 1) {
            return path.dirname(val);
         }
         return val;
      },
   }),
   search: res => ({
      name: 'index',
      type: 'search-list',
      message: 'Choose anime',
      choices: res,
      default: 0,
   }),
   filter: eps => ({
      name: 'filter',
      type: 'checkbox',
      message: 'Choose episodes',
      default: null,
      choices: [
         {
            name: 'Remove',
            value: '-',
         },
         {
            name: `${eps[0].ep}-${eps[eps.length - 1].ep}`,
            value: _.range(eps[0].ep, eps[eps.length - 1].ep + 1),
         },
         {
            name: `${eps[0].ep}-${Math.floor(eps[eps.length - 1].ep / 2)}`,
            value: _.range(
               eps[0].ep,
               Math.floor(eps[eps.length - 1].ep / 2) + 1
            ),
         },
         {
            name: `${Math.floor(eps[eps.length - 1].ep / 2) + 1}-${
               eps[eps.length - 1].ep
            }`,
            value: _.range(
               Math.floor(eps[eps.length - 1].ep / 2),
               eps[eps.length - 1].ep + 1
            ),
         },
         new inquirer.Separator(),
         ...eps.map(e => e.ep),
      ],
   }),
});
const PR = PROMPTS();

module.exports.callPrompts = async options => {
   const res = await searchUrls(options.S).catch(e => {
      console.error(e.message);
      process.exit(1);
   });
   const { index } = await inquirer.prompt([
      PR.search(res.map((e, k) => ({ name: e.title, value: k }))),
   ]);
   if (!options.M) {
      const { method } = await inquirer.prompt([PR.method]);
      options.M = options.method = method;
      if (options.M < 3) {
         const filename =
            res[index].title.replace(/[^\w]+/gi, '_').replace(/[^\w]+/gi, '_') +
            '.txt';
         const dirname = filename.replace(/\.txt$/i, '');
         const { path: file_path } = await inquirer.prompt([
            PR.path(method, options.M === 2 ? filename : dirname),
         ]);
         options.O = options.output = file_path;
      }
   }
   if (!options.E) {
      const { filter } = await inquirer.prompt([
         PR.filter(res[index].episodes),
      ]);
      console.log(filter);
      options.E = options.episodes =
         filter.length > 0
            ? _.chain(filter).flattenDeep().uniq().sortBy().value()
            : null;
   } else {
      // console.log(options.E);
      let rm = null;
      if (options.E[0] === '-') {
         rm = options.E.shift();
      }
      options.E = options.episodes = filterString.format(
         options.E.join(' '),
         res[index].eps
      );
      if (typeof rm === 'string') {
         options.E.unshift(rm);
      }
      // console.log(options.E);
   }
   await init(res[index], options);
};

const init = async (instance, options) => {
   if (instance instanceof SearchResult) {
      const method_msg = METHODS.find(e => e.value === options.M).name;
      let msgs = [];
      msgs[0] = ['ANIME:    ', instance.title];
      msgs[1] = ['EPISODES: ', instance.eps];
      msgs[2] = ['METHOD:   ', method_msg];
      let _formatted = format(
         '%s - %s',
         options.E[0] === '-' ? options.E[1] : options.E[0],
         options.E[options.E.length - 1]
      );
      if (options.E) {
         if (options.E[0] === '-') {
            _formatted = 'Excluding episodes ' + _formatted;
         } else {
            _formatted = 'Including episodes ' + _formatted;
         }
         msgs[3] = ['FILTERS:  ', _formatted];
      }
      if (options.M < 3) {
         msgs[4] = ['PATH:     ', options.O];
      }
      msgs = msgs.map(e => {
         e[0] = chalk.greenBright(e[0]);
         return e.join(' ');
      });
      // console.log(options);
      console.log(
         boxen(Object.values(msgs).join('\n'), {
            padding: 1,
            borderStyle: 'double',
         })
      );

      const FoundEpisodes = await GetEpisodes(instance, options);
      console.log(FoundEpisodes.length);
      // switch (options.M) {
      //    case 3:
      //       await clipboardUrls(instance, options);
      //       break;

      //    default:
      //       break;
      // }
   }
};
