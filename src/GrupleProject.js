const path = require('path')
const fs = require('fs')
const {devlog} = require('./utils')
const colors = require('colors/safe')
const GrupleConfig = require('./GrupleConfig')

function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

module.exports = class GrupleProject {
    constructor(projectDirectory) {
        if(fs.existsSync(projectDirectory) && fs.lstatSync(projectDirectory).isDirectory()) {
            devlog(`The directory ${projectDirectory} exists`)
            this.projectDirectoryExists = true
            if(!isEmpty(projectDirectory)) {
                devlog(`The project directory is not empty`)
                this.projectDirectoryEmpty = false
                const pathToGrupleConfig = path.resolve(projectDirectory, 'gruple.config.json')
                if(fs.existsSync(pathToGrupleConfig) && fs.lstatSync(pathToGrupleConfig).isFile()) {
                    devlog(`Gruple config was found`)
                    this.grupleConfig = new GrupleConfig(pathToGrupleConfig)
                } else {
                    devlog('Gruple config was not found')
                    this.grupleConfig = null
                }
            } else {
                devlog(`The project directory is empty`)
                this.projectDirectoryEmpty = true
                this.grupleConfig = null
            }
        } else {
            devlog(`The directory ${projectDirectory} does not exist`)
            this.projectDirectoryExists = false
            this.projectDirectoryEmpty = true
        }
        this.projectDirectory = projectDirectory
    }

    isProjectExist() {
        return !this.projectDirectoryEmpty && this.grupleConfig
    }

    createProjectDirectory() {
        if(!this.projectDirectoryExists) {
            fs.mkdirSync(this.projectDirectory)
            devlog('Project directory was created')
            this.projectDirectoryExists = true
        } else {
            devlog('Project directory cannot be created: it is already exists')
        }
    }

    createBasicFiles() {
            if(!this.grupleConfig) {
                if(this.projectDirectoryEmpty) {
                    const pathToGrupleConfig = path.resolve(this.projectDirectory, 'gruple.config.json')
                    const pathToSrc = path.resolve(this.projectDirectory, 'src')
                    const pathToNpmConfig = path.resolve(this.projectDirectory, 'package.json')
                    const pathToGrupleDir = path.resolve(this.projectDirectory, '.gruple')
                    fs.writeFileSync(pathToGrupleConfig, 'INIT')
                    devlog('gruple.config.json created with INIT')
                    fs.mkdirSync(pathToSrc)
                    devlog('src directory created')
                    fs.writeFileSync(pathToNpmConfig, '{}')
                    devlog('package.json created with {}')
                    fs.mkdirSync(pathToGrupleDir)
                    devlog('.gruple directory created')
                    this.grupleConfig = new GrupleConfig(pathToGrupleConfig)
                } else {
                    devlog('Files cannot be created: The project directory is not empty')
                }
            } else {
                devlog('The gruple.config.json cannot be created: it is already exists')
            }
    }

    initialize(name, type) {
        if(name && type && (type === 'dynamic' || type === 'static')) {
            this.grupleConfig.init(name, type)
        } else {
            console.error('Invalid arguments')
        }
    }

    startDashboardServer() {

    }

    installPackage(packageName) {

    }

    static showCreationMessage() {
        console.log(colors.green.bgBlack('Project created!'))
        console.log(colors.bold('Now you need to initialize it. Go into your project directory and use:'))
        console.log(' ' + colors.cyan('gruple dashboard') + ' | ' + colors.bold.yellow('[Recommended]') + ' To start the dashboard server (comfortable way)')
        console.log(' OR')
        console.log(' ' + colors.cyan('gruple init --type <type>') + ' | To quickly initialize a project (no GUI fast CLI way)')
        console.log('')
        console.log(colors.bold('To install packages into your project, use dashboard or the command:'))
        console.log(colors.cyan(' gruple install <package>'))
        console.log('')
        console.log(colors.bold('After any changes, including installing packages, click the Apply button in the dashboard or run the command:'))
        console.log(colors.cyan(' gruple apply'))
    }
}