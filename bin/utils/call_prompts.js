const chalk = require('chalk');
const inquirer = require('inquirer');
const { initial, method } = require('lodash');
const _ = require('lodash');
const path = require('path');
const { format } = require('util');
const { SearchResult } = require('../../dist/classes/search_result');
const { searchUrls } = require('./url_utils');
const debug = require('debug')('V');
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
   path: method => ({
      name: 'path',
      message: 'Specify file path',
      default:
         method === 2 ? path.join(process.cwd(), 'results.txt') : process.cwd(),
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
            name: 'All episodes',
            value: _.range(eps[0].ep, eps[eps.length - 1].ep + 1),
         },
         {
            name: 'First Half',
            value: _.range(
               eps[0].ep,
               Math.floor(eps[eps.length - 1].ep / 2) + 1
            ),
         },
         {
            name: 'Last Half',
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
         const { path: file_path } = await inquirer.prompt([PR.path(method)]);
         options.O = options.output = file_path;
      }
   }
   if (options.E === null) {
      const { filter } = await inquirer.prompt([
         PR.filter(res[index].episodes),
      ]);
      options.E = options.episodes = filter.length
         ? _.chain(filter).flattenDeep().uniq().sortBy().value()
         : null;
   }
   await init(res[index], options);
};

const init = async (instance, options) => {
   if (instance instanceof SearchResult) {
      const method_msg = METHODS.find(e => e.value === options.M).name;
      debug('ANIME:', instance.title);
      debug('EPISODES:', instance.eps);
      debug('METHOD:', method_msg);
      let _formatted = format(
         '%s - %s',
         options.E[0] === '-' ? options.E[1] : options.E[0],
         options.E[options.E.length - 1]
      );
      if (options.E) {
         if (options.E[0] === '-') {
            _formatted = 'Remove - ' + _formatted;
         }
         debug('FILTERS:', _formatted);
      }
      if (options.M < 3) {
         debug('PATH:', options.O);
      }
      // switch (options.M) {
      //    case 1:
      //       break;

      //    default:
      //       break;
      // }
   }
};
