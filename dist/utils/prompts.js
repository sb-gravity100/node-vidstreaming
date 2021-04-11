"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

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
  type: 'list',
  name: 'res',
  message: 'Video quality?',
  choices: ['1080', '720', '480', '360', {
    name: 'Original',
    value: undefined
  }],
  default: undefined,
  when: !options.R && !options.resolution
}, {
  type: 'input',
  name: 'download',
  message: 'Download path:',
  default: false,
  when: !options.O && !options.D,
  validate: input => {
    if (input && _path.default.extname(input) !== '') {
      return `Path must be a folder path.`;
    }

    return true;
  }
}, {
  type: 'input',
  name: 'output',
  message: 'Output file:',
  default: false,
  when: !options.D && !options.O,
  validate: input => {
    if (input && _path.default.extname(input) !== '.txt') {
      return `File must be a text - (.txt) file.`;
    }

    return true;
  }
}];

exports.default = _default;