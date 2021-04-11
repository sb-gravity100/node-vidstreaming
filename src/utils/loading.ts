import clui from 'clui';
const LoadingIcons: Array<string> = ['⣾⣷', '⣽⣯', '⣻⣟', '⢿⡿', '⡿⢿', '⣟⣻', '⣯⣽', '⣷⣾'];
const loading = new clui.Spinner('Starting...', LoadingIcons);

export default loading;
