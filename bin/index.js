const inquirer = require('inquirer');
const { options } = require('./utils/args');

if (options.S) {
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
      options.S = answers.search
      options.search = answers.search
      callPrompts(options)
    });
}
