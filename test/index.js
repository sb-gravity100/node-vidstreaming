// const Vidstreaming = require('../dist');
// const _ = require('lodash');
// const { FCDN } = require('../dist/classes/mirrors');

// Vidstreaming.term('kaifuku')
//    .then(async ([anime]) => {
//       const range = _.range(1, 10);
//       const eps = await anime.getEpisodes({ filter: range.join(' ') });
//       // const sources = eps[0].get().sources;
//       console.log(eps.length);
//       // const source = sources.find(e => e instanceof FCDN);
//       // if (source instanceof FCDN) {
//       //    const fcdn = await source.getSources();
//       //    console.log(fcdn);
//       // }
//    })
//    .catch(console.log);

const Promise1 = async () => {
   return 'Hello';
};

const Promise2 = () => {
   return new Promise(resolve => resolve('Promise2'));
};

Promise2().then(console.log);
Promise1().then(console.log);
console.log('Not a promise');
