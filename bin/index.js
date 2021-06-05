const inquirer = require('inquirer');
const { options } = require('./utils/args');
const { callPrompts } = require('./utils/call_prompts');

if (options.S) {
   console.log('Searching `%s`...', options.S);
   callPrompts(options);
} else {
   inquirer
      .prompt([
         {
            name: 'search',
            message: 'Search Anime',
            validate(val) {
               if (!val) {
                  return 'Required!';
               }
               return true;
            },
         },
      ])
      .then(answers => {
         options.S = options.search = answers.search;
         callPrompts(options);
      });
}
