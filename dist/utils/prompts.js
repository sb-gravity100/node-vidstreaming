"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (options, list) => [{
  type: 'search-list',
  name: 'anime',
  message: 'Search results:',
  choices: list.map(a => ({
    name: a.title,
    value: a
  })),
  default: 1
}, {
  type: 'input',
  name: 'download',
  message: 'Download path:',
  default: false,
  when: !options.D && !options.O,
  transformer: input => {
    if (!input || input === '') {
      return false;
    }

    options.D = input;
    options.download = input;
    return input;
  }
}, {
  type: 'input',
  name: 'output',
  message: 'Output file:',
  default: false,
  when: !options.D && !options.O,
  validate: input => {
    if (input && input.search(/\.txt$/i) === -1) {
      return `File must be a text - (.txt) file.`;
    }

    return true;
  },
  transformer: input => {
    if (!input || input === '') {
      return false;
    }

    options.O = input;
    options.output = input;
    return input;
  }
}];

exports.default = _default;