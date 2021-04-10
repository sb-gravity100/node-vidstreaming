import { Argv } from './args'
import { SearchData } from '../vidstreaming'
import path from 'path'

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
    choices: ['1080', '720', '480', '360', {name: 'Original', value: undefined}],
    default: undefined,
    when: !options.R && !options.resolution,
  },
  {
    type: 'input',
    name: 'download',
    message: 'Download path:',
    default: false,
    when: !options.D && !options.O,
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
