import cheerio from 'cheerio';
import axios from 'axios';

const url = 'https://gogo-stream.com';
const search = 'bakemonogatari';
const getList = async link => {
   const { data } = await axios.get(link, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      baseURL: url,
   });
   const $ = cheerio.load(data);
   const list = $('.listing.items.lists .video-block a');
   return list
};
const fetchAnime = async search => {
   const anime = await axios.get('/ajax-search.html', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      params: {
         keyword: search,
      },
      baseURL: url,
   });
   const $ = cheerio.load(anime.data.content);
   const link = $('ul a').attr('href')
   const list = await getList(link)
   console.log(list)
};

fetchAnime(search);
