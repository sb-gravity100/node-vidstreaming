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
   },
};

const bin = async () => {
   const opts = options.argv;
   if (!opts.S) {
      const answers = await inquirer.prompt([PROMPTS.search]);
      if (answers.search) {
         opts.S = opts.search = answers.search;
      }
   }
   if (opts.E && typeof opts.E[0] === 'string' && opts.E[0].match(/R/i)) {
      opts.E.splice(0, 1, '-');
      opts.episodes.splice(0, 1, '-');
   }
   // console.log(opts);
   await callPrompts(opts);
};

bin().catch(console.log);
