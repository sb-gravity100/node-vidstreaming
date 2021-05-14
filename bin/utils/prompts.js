const path = require('path');

module.exports = (options, list) => [
  {
    type: 'search-list',
    name: 'anime',
    message: 'Search results:',
    choices: list.map(a => ({ name: a.title, value: a }))
  },
  {
    type: 'list',
    name: 'res',
    message: 'Video quality?',
    choices: [
      {name: 'StreamQuality(High)', value: '0'},
      {name: 'StreamQuality(Low)', value: '1'},
      {name: '4anime(1080)', value: '2'},
      // {name: 'StreamQuality(High)', value: '3'},
      /*'1080', '720', '480', '360', {name: 'Original', value: undefined},
       */
    ],
    default: undefined,
    when: !options.R && !options.resolution,
  },
  {
    type: 'input',
    name: 'download',
    message: 'Download path:',
    default: false,
    when: !options.O && !options.D,
    validate: input => {
      if (input && path.extname(input) !== '') {
        return `Path must be a folder path.`;
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'output',
    message: 'Output file:',
    default: false,
    when: !options.D && !options.O,
    validate: input => {
      if (input && path.extname(input) !== '.txt') {
        return `File must be a text - (.txt) file.`;
      }
      return true;
    },
  },
];
