import clui from 'clui';
const LoadingIcons: Array<string> = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
const loading = new clui.Spinner('...', LoadingIcons);

export default loading;
