import Vidstreaming from '../vidstreaming';

export const searchUrls = async search => {
   const vid = new Vidstreaming();
   vid.on('error', err => {
      if (err.code === 'ANINOTFOUND') {
         console.error(err.message);
      } else {
         console.log('Something went wrong. Check your internet connection');
      }
      process.exit(1);
   });
   return await vid.term(search);
};
