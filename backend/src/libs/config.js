module.exports = app => {
  const env = process.env.NODE_ENV

  return env ? require(`./config.${env}.js`) : require('./config.development.js')
}
