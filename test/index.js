const Vidstreaming = require('../dist');

Vidstreaming.term('kaifuku').then(async res => {
   await res[0].getEpisodes({ filter: '1 2 3'})
   console.log(res[0].get())
}).catch(console.log)
