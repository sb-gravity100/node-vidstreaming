import axios from 'axios';
const url = 'https://gogo-stream.com';
export const instance = axios.create({
   baseURL: url,
   headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
         'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
   },

});
