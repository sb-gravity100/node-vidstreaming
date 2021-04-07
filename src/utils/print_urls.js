import loading from './loading';
import { Vidstreaming } from '../vidstreaming';

export const printUrls = (name, res, filter) => {
  const vid = new Vidstreaming(name, res, filter);
  loading.start();
  loading.message('Printing urls to console...');

  // Error listener
  vid.on('error', (err, line) => {
    console.error('Something went wrong', line, '\n', err.message);
    process.exit(1);
  });

  vid.episodes().then(data => {
    if (filter.async) {
      // Loaded listener
      vid.on('loaded', (dataLength, length, item) => {
        if (dataLength === length) {
          loading.stop();
          console.log(item.src);
          console.log('Done');
          process.exit(0);
        } else {
          process.stdout.clearLine();
          loading.message(`${dataLength} out of ${length} - Done'`);
          console.log(item.src);
        }
      });
    } else {
      data.each(d => console.log(d.src));
    }
  });
};
