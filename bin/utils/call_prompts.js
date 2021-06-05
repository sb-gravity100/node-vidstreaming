const chalk = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');
const debug = require('debug')('V');
const { searchUrls } = require('./url_utils');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const PROMPTS = {
   method: {
      type: 'search-list',
      name: 'method',
      default: null,
      message: 'Choose methods',
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
};

module.exports.callPrompts = async options => {
   const res = await searchUrls(options.S).catch(e => {
      console.error(e.message);
      process.exit(1);
   });
   const { index } = await inquirer.prompt([
      PROMPTS.search(res.map((e, k) => ({ name: e.title, value: k }))),
   ]);
   const { method } = await inquirer.prompt([PROMPTS.method]);
   if (typeof method === 'number') {
      options.M = options.method = method;
      const { path: file_path } = await inquirer.prompt([PROMPTS.path(method)]);
      if (typeof file_path === 'string') {
         options.O = options.output = file_path;
      }
   }
};
