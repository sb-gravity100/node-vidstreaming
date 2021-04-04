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

  // Handler to be invoked when loaded
  const doneHandler = item => {
    const url = item.src;
    stream.cork();
    stream.write(`${url}\n`);
    process.nextTick(() => stream.uncork());
  };
  // Loaded listener
  if (filter.async) {
    vid.on('loaded', (dataLength, length, item) => {
      if (dataLength === length) {
        doneHandler(item);
        loading.stop();
        console.log('Done');
        process.exit(0);
      } else {
        process.stdout.clearLine();
        loading.message(`${dataLength} out of ${length} - Done`);
        doneHandler(item);
      }
    });
  } else {
    vid.episodes().then(data => data.forEach(d => doneHandler(d)));
  }

  // Error listener
  vid.on('error', (err, line) => {
    console.error('Something went wrong', line, '\n', err.message);
    fs.unlinkSync(output);
    process.exit(1);
  });
};
