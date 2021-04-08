import Vidstreaming from '.dist/vidstreaming';

describe('Vidstreaming API test...', () => {
   test('Basic episode fetching...', async done => {
      const results = await new Vidstreaming('5-toubun').episodes(false);
      expect.hasAssertions();
      expect(results).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               filename: expect.any(String),
               id: expect.stringMatching(/[A-z]{7,}/gi),
               src: expect.any(String),
               ext: expect.stringMatching(/\.(mp4|m3u)$/gi),
               title: expect.any(String),
               ep: expect.any(Number),
            }),
         ])
      );
      done();
   }, 60000);

   test('Basic async episode fetching...', async done => {
      const results = await new Vidstreaming('5-toubun', null, {
         async: true,
      }).episodes(false);
      expect.hasAssertions();
      expect(results).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               filename: expect.any(String),
               id: expect.stringMatching(/[A-z]{7,}/gi),
               src: expect.any(String),
               ext: expect.stringMatching(/\.(mp4|m3u)$/gi),
               title: expect.any(String),
               ep: expect.any(Number),
            }),
         ])
      );
      done();
   }, 60000);

   test('Error testing...', done => {
      const vid = new Vidstreaming('some anime that doesnt exist');
      vid.episodes(false);
      vid.on('error', (err, msg) => {
         expect.hasAssertions();
         expect(err).toMatchSnapshot();
         expect(msg).toMatch(/^error/g);
         expect(err.code).toMatch(/^E/g);
         done();
      });
   }, 60000);

   test('Basic episode fetching with filtering...', async done => {
      const results = await new Vidstreaming('5-toubun', null, {
         episodes: [1, 5, 3],
      }).episodes(false);
      expect(results).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               filename: expect.any(String),
               id: expect.stringMatching(/[A-z]{7,}/gi),
               src: expect.any(String),
               ext: expect.stringMatching(/\.(mp4|m3u)$/gi),
               title: expect.stringMatching(/episode [0-9]{1,4}/gi),
               ep: expect.any(Number),
            }),
         ])
      );
      done();
   }, 120000);
});
