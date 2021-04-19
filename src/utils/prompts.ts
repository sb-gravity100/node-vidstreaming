import { Argv } from './args';
import { SearchData } from '../vidstreaming';
import path from 'path';

export default (options: Argv, list: Array<SearchData> | undefined) => [
  {
    type: 'search-list',
    name: 'anime',
    message: 'Search results:',
    choices: list.map((a: SearchData) => ({ name: a.title, value: a })),
    default: 1,
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
    validate: (input: any) => {
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
    validate: (input: any) => {
      if (input && path.extname(input) !== '.txt') {
        return `File must be a text - (.txt) file.`;
      }
      return true;
    },
  },
];
