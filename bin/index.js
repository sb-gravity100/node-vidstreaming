process.env.DEBUG = 'V*';
const inquirer = require('inquirer');
const { options } = require('./utils/args');
const { callPrompts } = require('./utils/call_prompts');

const PROMPTS = {
   search: {
      name: 'search',
      message: 'Search Anime',
      default: '',
      validate(val) {
         if (!val) {
            return 'Required!';
         }
         return true;
      },
      when: !options.S,
   },
};

const bin = async () => {
   const answers = await inquirer.prompt([PROMPTS.search]);
   if (answers.search) {
      options.S = options.search = answers.search;
   }
   await callPrompts(options);
};

bin();
