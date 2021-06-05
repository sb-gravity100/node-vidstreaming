// const clipboard = require('clipboardy');
const chalk = require('chalk');
const fs = require('fs');
const Vidstreaming = require('../../dist');
const { SearchResult } = require('../../dist/classes/search_result');

module.exports.searchUrls = async (search = '') => {
   if (!search) {
      throw new Error('No search specified');
   }
   return await Vidstreaming.term(search.trim().normalize());
};

module.exports.clipboardUrls = (instance, options = {}) => {
   if (instance instanceof SearchResult) {
      instance.getEpisodes({
         filter: options.filter || null,
      });
   }
};
