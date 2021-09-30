const Vidstreaming = require('../dist');
const { FCDN } = require('../dist/classes/mirrors');
const _ = require('lodash');
const fs = require('fs');
const inquirer = require('inquirer');

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

process.argv.splice(0, 2);

async function boot() {
   try {
      console.log(process.argv[0]);
      const searchRes = await Vidstreaming.term(process.argv[0]);
      const { index } = await inquirer.prompt([
         {
            name: 'index',
            type: 'search-list',
            message: 'Choose anime',
            choices: searchRes.map((e, i) => ({
               name: e.title,
               value: i,
            })),
         },
      ]);
      const anime = searchRes[index];
      const eps = await anime.getEpisodes();
      const sources = await Promise.all(eps.map((e) => e.getSources()));
      eps.forEach((e) => console.log(e.getId()));

      var fcdn = sources.map((e) => e.find((f) => f instanceof FCDN));
      var HDP = sources.map((e) => e.find((f) => f.name === 'HDP'));
      // console.log(HDP);
      await fs.promises.writeFile(
         './links/' + _.snakeCase(anime.title) + '.txt',
         HDP.map((e) => e && e.links).join('\n')
      );
   } catch (error) {
      throw error;
   }
}

boot().catch(console.log);
