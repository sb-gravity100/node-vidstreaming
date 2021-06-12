const chalk = require('chalk');
const inquirer = require('inquirer');
const { initial } = require('lodash');
const _ = require('lodash');
const path = require('path');
// const debug = require('debug')('V');
const { searchUrls } = require('./url_utils');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const PROMPTS = () => ({
   method: {
      type: 'search-list',
      name: 'method',
      default: 3,
      message: 'Choose methods',
      choices: [
         { name: 'Download Files', value: 1 },
         { name: 'Copy URLs to txt file', value: 2 },
         { name: 'Copy to Clipboard', value: 3 },
      ],
   },
   path: method => ({
      name: 'path',
      message: 'Specify file path',
      default: 3,
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
});

module.exports.callPrompts = async options => {
   const PR = PROMPTS();
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
   await init(res[index], options);
};

const init = async (instance, options) => {
   switch (options.M) {
      case 1:
         break;

      default:
         break;
   }
};
