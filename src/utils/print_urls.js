import loading from './loading'
import { Vidstreaming } from '../vidstreaming'

export const printUrls = (name, res, filter) => {
  const vid = new Vidstreaming(name, res, filter);
  loading.start();
  loading.message('Printing urls to console...');

  // Loaded listener
  vid.on('loaded', (dataLength, length, item) => {
    if (dataLength === length) {
      loading.stop();
      console.log(item.src);
      console.log('Done');
      process.exit(0);
    } else {
      process.stdout.clearLine();
      loading.message(`${dataLength} out of ${length} - Done'`)
      console.log(item.src);
    }
  });
};
