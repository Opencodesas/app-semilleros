module.exports = {
    publicPath: import.meta.env.VITE_ENV === 'prod'
    ? '/app-semilleros/'
    : '/'
}