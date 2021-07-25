const clipboard = require('clipboardy');
const chalk = require('chalk');
const fs = require('fs');
const Vidstreaming = require('../../dist');
const { SearchResult } = require('../../dist/classes/search_result');

module.exports.GetEpisodes = function GetEpisodes(instance, options) {
   console.log(options.E.join(' '));
   if (instance instanceof SearchResult) {
      return instance.getEpisodes({
         filter: options.E.join(' ') || undefined,
      });
   }
};

module.exports.searchUrls = async function searchUrls(search = '') {
   if (!search) {
      throw new Error('No search specified');
   }
   return await Vidstreaming.term(search.trim());
};

module.exports.clipboardUrls = async function clipboardUrls(
   instance,
   options
) {};

module.exports.writeUrls = (instance, options) => {};
