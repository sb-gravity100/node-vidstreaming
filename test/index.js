require('dotenv').config();
const Vidstreaming = require('../dist');
const { FCDN } = require('../dist/classes/mirrors');

Vidstreaming.term('kaifuku')
   .then(async ([anime]) => {
      const eps = await anime.getEpisodes({ filter: '1' });
      const sources = eps[0].get().sources;
      const source = sources.find(e => e instanceof FCDN);
      if (source instanceof FCDN) {
         const fcdn = await source.getSources();
         console.log(fcdn);
      }
   })
   .catch(console.log);
