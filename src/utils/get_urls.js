import fs from 'fs';
import loading from './loading';
import { Vidstreaming } from '../vidstreaming';

// This wil print the urls to the specified file
export const getUrls = (name, output, res, filter) => {
  // Initialize everything
  const vid = new Vidstreaming(name, res, filter);
  fs.writeFileSync(output, null);
  loading.start();
  const stream = fs.createWriteStream(output, { flags: 'a+' });
  loading.message('Printing urls to file...');

  // Url sorter
  const sortUrls = () => {};

  // Handler to be invoked when loaded
  const doneHandler = item => {
    const url = item.src;
    stream.cork();
    stream.write(`${url}\n`);
    process.nextTick(() => stream.uncork());
  };
  // Loaded listener
  vid.on('loaded', (dataLength, length, item) => {
    if (dataLength === length) {
      doneHandler(item);
      loading.stop();
      console.log('Done');
      sortUrls();
      process.exit(0);
    } else {
      process.stdout.clearLine();
      loading.message(`${dataLength} out of ${length} - Done`);
      doneHandler(item);
    }
  });
};
