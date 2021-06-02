const chalk = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');
const { middleware } = require('./utils)/middleware');
const prompts = require('./utils/prompts');
const {
  searchUrls,
  writeUrls,
  clipboardUrls,
  downloadUrls,
} = require('./utils/url_utils');
const {
  boxxx,
  downloadModeBox,
  outputModeBox,
  printModeBox,
} = require('./utils/boxes');

inquirer.registerPrompt('search-list', require('inquirer-search-list'));
module.exports.callPrompts = options => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'process',
      default: null,
      message: 'Choose methods',
      choices: [{ name: 'Download Files', value: 0 }, { name: 'Copy URLs to txt file' , value: 1}, { name: 'Copy to Clipboard', value: null }]
    },
    {
       name: 'path',
       message: 'Specify file path',
       validate: val => {
          const ext = path.extname(val)
          if (ext && !ext.match(/^\.txt$/i)) {
             return 'Path must be txt file or a directory'
          }
          return true
       }
    }
  ]);
};
