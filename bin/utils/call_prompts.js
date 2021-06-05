const chalk = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');
const { searchUrls } = require('./url_utils');
// const { middleware } = require('./utils/middleware');
// const {
//    searchUrls,
//    writeUrls,
//    clipboardUrls,
//    downloadUrls,
// } = require('./utils/url_utils');
// const {
//    boxxx,
//    downloadModeBox,
//    outputModeBox,
//    printModeBox,
// } = require('./utils/boxes');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const PROMPTS = {
   method: {
      type: 'list',
      name: 'method',
      default: null,
      message: 'Choose methods',
      choices: [
         { name: 'Download Files', value: 0 },
         { name: 'Copy URLs to txt file', value: 1 },
         { name: 'Copy to Clipboard', value: null },
      ],
   },
   path: {
      name: 'path',
      message: 'Specify file path',
      validate: val => {
         const ext = path.extname(val);
         if (ext && !ext.match(/^\.txt$/i)) {
            return 'Path must be txt file or a directory';
         }
         return true;
      },
   },
   results: (res = []) => ({
      name: 'index',
      message: 'Choose Anime',
      type: 'search-list',
      choices: res.map((e, k) => ({ name: e.title, value: k })),
      default: 0,
   }),
};

module.exports.callPrompts = async options => {
   const search_results = await searchUrls(options.search);
   const { index } = await inquirer.prompt([PROMPTS.results(search_results)]);
   const anime = search_results[index];
   const { method } = await inquirer.prompt([PROMPTS.method]);
   if (method !== null) {
      const ans = await inquirer.prompt([PROMPTS.path]);
      path = ans.path;
   }
   console.log(options);
};
