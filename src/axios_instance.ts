import axios from 'axios';
const url = 'https://streamani.net';
export const instance = axios.create({
   baseURL: url,
   headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
         'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
   },
   validateStatus: s => s < 500,
});
