const chalk = require('chalk');
const inquirer = require('inquirer');
const { initial } = require('lodash');
const _ = require('lodash');
const path = require('path');
const debug = require('debug')('V');
const { searchUrls } = require('./url_utils');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const PROMPTS = options => ({
   method: {
      type: 'search-list',
      name: 'method',
      default: null,
      message: 'Choose methods',
      when: !options.M,
      choices: [
         { name: 'Download Files', value: 0 },
         { name: 'Copy URLs to txt file', value: 1 },
         { name: 'Copy to Clipboard', value: null },
      ],
   },
   path: method => ({
      name: 'path',
      message: 'Specify file path',
      default: '',
      when: !options.E,
      validate(val) {
         if (!val) {
            return 'Must provide a path';
         }
         if (method === 1) {
            const ext = path.extname(val);
            if (ext !== '.txt') {
               return 'Path must be txt file or a directory';
            }
         }
         return true;
      },
      transformer: val => {
         if (method === 0) {
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
   const PR = PROMPTS(options);
   const res = await searchUrls(options.S).catch(e => {
      console.error(e.message);
      process.exit(1);
   });
   const { index } = await inquirer.prompt([
      PR.search(res.map((e, k) => ({ name: e.title, value: k }))),
   ]);
   const { method } = await inquirer.prompt([PR.method]);
   if (typeof method === 'number') {
      options.M = options.method = options.M;
      const { path: file_path } = await inquirer.prompt([PR.path(method)]);
      if (typeof file_path === 'string') {
         options.O = options.output = file_path;
      }
   }
   await init(options);
};
