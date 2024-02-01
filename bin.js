#!/usr/bin/env node
const process = require('process')
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const npm = require('npm-commands')
const { Command } = require('commander')
const GrupleProject = require('./src/GrupleProject')
const colors = require('colors/safe')

const currentDirectory = process.cwd()
const args = process.argv
let projectPath = ''
const program = new Command()

program
    .name('Gruple')
    .description('Gruple description')
    .version('0.0.1', '-v, --version')

program.command('create')
    .description('Create a new project')
    .argument('<path>', 'Path to the new project folder')
    .action((str) => {
        const project = new GrupleProject(path.resolve(currentDirectory, str))
        if(!project.isProjectExist()) {
            project.createProjectDirectory()
            project.createBasicFiles()
            GrupleProject.showCreationMessage()
        } else {
            console.log('Project already exists')
        }
    })

program.command('dashboard')
    .description('Start dashboard server')
    .action(() => {
        try {
            const project = new GrupleProject(currentDirectory)
            project.startDashboardServer()
        } catch(e) {
            console.log(colors.red(e.message))
        }
    })

program.command('init')
    .description('Initialize the project')
    .argument('<name>', 'Project name')
    .argument('<type>', 'Project type')
    .action((name, type) => {
        const project = new GrupleProject(currentDirectory)
        project.initialize(name, type)
    })

program.command('install')
    .description('Install package')
    .argument('<package>', 'Package name')
    .action((arg) => {
        const project = new GrupleProject(currentDirectory)
        // project.installPackage(arg)
    })

program.command('apply')
    .description('Apply the Gruple configuration and thereby configure the project')
    .action(() => {
        const project = new GrupleProject(currentDirectory)
        // project.apply()
    })

program.parse()



// if(args[2] === 'create') {
//     projectPath = path.resolve(currentDirectory, args[3] || '')
//     fs.mkdirSync(projectPath)
//     fs.writeFileSync(path.resolve(projectPath, 'package.json'), '{}')
//     fs.writeFileSync(path.resolve(projectPath, 'gruple.config.json'), 'INIT')
//     fs.mkdirSync(path.resolve(projectPath, '.gruple'))
//     fs.mkdirSync(path.resolve(projectPath, 'src'))
//     console.log('Project created')

//     const app = express()
//     const jsonParser = bodyParser.json()
//     app.use(express.static(path.resolve(__dirname, 'layout')))
//     app.get('/', (req, res) => {
//         const config = fs.readFileSync(path.resolve(projectPath, 'gruple.config.json'), {encoding: 'utf-8', flag: 'r'})
//         res.sendFile(path.resolve(__dirname, 'index.html'))
//     })
//     app.post('/init', jsonParser, (req, res) => {
//         console.log(req.body)
//         fs.writeFileSync(path.resolve(projectPath, 'package.json'), JSON.stringify({
//             name: req.body.name,
//             version: '0.0.1',
//             description: 'Gruple project',
//             devDependencies: {
//                 nodemon: '*'
//             }
//         }))
//         fs.writeFileSync(path.resolve(projectPath, 'gruple.config.json'), JSON.stringify({
//             name: req.body.name
//         }))
//         npm().cwd(projectPath).install()
//         res.send('OK')
//     })
//     app.listen(4333, () => {
//         console.log('Configuration panel started at localhost:4333')
//     })
// } else if(args[2] == 'dashboard') {
//     console.log('dashboard')
// } else if(args[2] == 'install') {
//     console.log('installing package')
// }

