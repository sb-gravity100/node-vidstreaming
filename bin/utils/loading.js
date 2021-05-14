const clui =- require('clui');
const LoadingIcons = ['⣾⣷', '⣽⣯', '⣻⣟', '⢿⡿', '⡿⢿', '⣟⣻', '⣯⣽', '⣷⣾'];
const loading = new clui.Spinner('Starting...', LoadingIcons);

module.exports = loading;
