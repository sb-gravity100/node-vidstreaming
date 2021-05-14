const { Vidstreaming } = require('../dist');

const Anime = new Vidstreaming()

Anime.term('5-toubun').then(results => {
   console.log(results[0].get())
})
