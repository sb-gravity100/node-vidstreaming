// const clipboard = require('clipboardy');
const chalk = require('chalk');
// const fs = require('fs');
// const ProgressBar = require('progress');
// const loading = require('./loading');
const Vidstreaming = require('../../dist');
const { SearchResult } = require('../../dist/classes/search_result');

module.exports.searchUrls = async (search = '') => {
   try {
      if (!search) {
         throw 'No search specified';
      }
      return await Vidstreaming.term(search);
   } catch (e) {
      if (e.code === 'ANIMENOTFOUND') {
         console.log(e.message);
      } else {
         console.log('Something went wrong.');
         process.exit(1);
      }
   }
};

module.exports.clipboardUrls = (instance, options = {}) => {
   if (instance instanceof SearchResult) {
      instance.getEpisodes({
         filter: options.filter || null,
      });
   }
};
