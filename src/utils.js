const colors = require('colors/safe')

module.exports = {
  devlog(message) {
    console.log(colors.green('[DEV-LOG] ') + message)
  },
  deverr(message) {
    console.error(colors.red.bold('[DEV-ERROR] ') + message)
    throw new Error(message)
  }
}