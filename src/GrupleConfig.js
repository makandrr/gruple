const fs = require('fs')
const {devlog, deverr} = require('./utils')
const constants = require('./constants')

module.exports = class GrupleConfig {
  constructor(path) {
    if(fs.existsSync(path) && fs.lstatSync(path).isFile()) {
      const configContent = String(fs.readFileSync(path))
      if(configContent === 'INIT') {
        devlog('The gruple configuration file has not been initialized')
      } else if(GrupleConfig.checkConfigurationFileContent(configContent)) {
        devlog('The gruple configuration file is valid')
      } else {
        deverr('The gruple configuration file is invalid')
      }
      this.configPath = path
    } else {
      deverr('There is no configuration file')
    }
  }

  getConfigContent() {
    return String(fs.readFileSync(this.configPath))
  }

  setConfigContent(content) {
    fs.writeFileSync(this.configPath, content)
  }

  init(name, type) {
    if(this.getConfigContent() === 'INIT') {
      const configTemplate = constants.initialConfigTemplate
      configTemplate.name = name
      configTemplate.type = type
      this.setConfigContent(JSON.stringify(configTemplate))
      console.log('The project was initialized')
    } else {
      console.log('The project is already initialized')
    }
  }

  static checkConfigurationFileContent() {
    // TO IMPLEMENT
    return true
  }
}