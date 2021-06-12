const clipboard = require('clipboardy');
const chalk = require('chalk');
const fs = require('fs');
const Vidstreaming = require('../../dist');
const { SearchResult } = require('../../dist/classes/search_result');

module.exports.GetEpisodes = (instance, options) => {
   if (instance instanceof SearchResult) {
      return instance.getEpisodes({
         filter: options.E || null,
      });
   }
};

module.exports.searchUrls = async (search = '') => {
   if (!search) {
      throw new Error('No search specified');
   }
   return await Vidstreaming.term(search.trim().normalize());
};

module.exports.clipboardUrls = async (instance, options) => {};

module.exports.writeUrls = (instance, options) => {};
