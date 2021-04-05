import Vidstreaming from './vidstreaming';

const vid = new Vidstreaming('5-toubun');
test('get all episodes', () => {
   // vid.on('error', err => {
   //    console.log('Something went wrong.');
   //    if (err.code === 'ENOTFOUND') {
   //       console.log('Check your internet connection.');
   //    }
   //    process.exit(0);
   // });

   vid.episodes(false).then(results => {
      expect(Object.keys(results)).toContain('src');
   });
});
