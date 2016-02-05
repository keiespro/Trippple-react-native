#! /usr/bin/env babel-node

import program from 'commander-plus';
import Promise from 'bluebird';
import chalk from 'chalk';
import jsonfile from 'jsonfile';
import firebaseTool from 'firebase-tools';
import fs from 'fs.extra';
import {exec} from 'child_process';
const DIR = process.cwd()

const NPM_CONFIG_PREFIX = process.env.npm_config_prefix || '';

const UPDATE_CHECK_FILE =  `${DIR}/AutoUpdater/public/update.json`;

const VERSION_FILE = `${DIR}/VERSION.json`;
const ENV = process.env.NODE_ENV || 'development';
const FILENAME = `main.jsbundle`;

const VERSIONS = jsonfile.readFileSync(VERSION_FILE);
const JS_VERSION = VERSIONS['js'];
const APP_VERSION = VERSIONS['app'];

const HISTORY_FILE =  `${DIR}/AutoUpdater/.updatehistory`;
const HISTORY = jsonfile.readFileSync(HISTORY_FILE);
const BUILD_HISTORY = HISTORY.builds;
const LAST_BUILD = BUILD_HISTORY[0] || {
  timestamp: Date.now(),
  build: 0,
  appVersion: APP_VERSION,
  jsVersion: JS_VERSION
};
const LAST_BUILD_TIMESTAMP = LAST_BUILD.timestamp;
const LAST_BUILD_NUMBER = LAST_BUILD.build;

// coloring
const errorize = chalk.bold.red;
const bg = chalk.bgMagenta;
const success = chalk.green;

console.log(bg(ENV))


class TripppleTools{

  constructor(){
    this.jsVersion = JS_VERSION;
    this.buildNumber = LAST_BUILD_NUMBER;

  }

  init(){
    console.log(chalk.bgMagenta.bold('\nTrippple\n'));
    this.presentChoice()
  }

  getUniqueFilename(){ return `main${this.jsVersion}.jsbundle`; }

  getUpdateDotJsonPath(){ return `${DIR}/AutoUpdater/public/${this.getUniqueFilename()}` }

  getEnvironmentBaseUrl(){
    return BASE_URLS[ENV]
  }

  getBackupPath(){ return `${DIR}/AutoUpdater/bundles/` }

  dev(){
    console.log(chalk.bgMagenta.yellow('\n Serving update.json and compiled bundle \n'));
    firebaseTool.serve({host:'x.local'})
  }

  presentChoice(){
    let choiceList = ['dev', 'dist', 'compile', 'bump', 'deploy', 'rollback', 'exit'];

    program.choose(choiceList, (i) => {

      console.log(chalk.bgMagenta.bold('\n'+choiceList[i].toUpperCase()+'\n'));


      if(choiceList[i] == 'exit'){
        console.log(chalk.yellow(' 🚀 GOOD BYE\n'));
        process.exit()
      }else{
        var choice = this[choiceList[i]];
        choice.apply(this);
      }

    })
  }

  compile(opts={}) {
    console.log(bg('Compiling jsbundle'))
    return new Promise((resolve, reject) => {
      this.timestamp = Date.now()

      const flags = `bundle --platform=ios --entry-file=index.ios.js --dev=${ENV == 'development'} --bundle-output=./${this.getUniqueFilename()} --verbose --reset-cache=true`;


      const child = exec(`${NPM_CONFIG_PREFIX}/bin/react-native ${flags}`)

      // const child = exec(`npm run dist`)

      child.stdout.on('data', (data) => console.log(chalk.magenta('|> ') + data));

      child.stderr.on('data', (data) => console.log(chalk.white('|> ') + data));

      child.on('close', (code) => {
        console.log(chalk.yellow(`|> PACKAGER FINISHED`));

        console.log(chalk.yellow(`|> child process exited with code ${code}`));
        if(!opts.dist){
          return resolve(this.cleanUp())
        }else{
          resolve()
        }
      });

      child.on('error', (err) => {
        console.log(errorize('Failed to start child process.'));
        return reject(this.cleanUp())
      });
    });
  }
  generateNewVersionFile(){
    return {
      "app":APP_VERSION,
      "js": this.jsVersion
    }

  }

  bump(opts={}){


    return new Promise((resolve, reject) => {
      let V = this.jsVersion;

      let pieces =  V.split('.')

      let bumped = parseInt(pieces.pop()) + (opts.rollback ? -1 : 1)
      let newJSVersionNumber = [...pieces,bumped].join('.')
      console.log(bg(`Bump JS version and regenerate update.json ${V} - ${newJSVersionNumber}`));

      this.jsVersion = newJSVersionNumber;
      this.buildNumber++;
      /* UPDATE.JSON TEMPLATE ----------------------------------------------------  */

      let updateJson = {
        "version": newJSVersionNumber,
        "minContainerVersion": APP_VERSION,
        "url": {
          "url": this.getUniqueFilename(),
          "isRelative": true
        }
      };

      /* END UPDATE.JSON TEMPLATE ------------------------------------------------- */

      console.log(success(`\n${this.getUniqueFilename()} \n`));
      console.log(chalk.bgYellow(JSON.stringify(updateJson)));

      jsonfile.writeFileSync(UPDATE_CHECK_FILE, updateJson, {spaces: 2}, (err) => {
        console.error(errorize('1'))
        console.error(errorize(err))
      });
      this.updateJson = updateJson;
      jsonfile.writeFileSync(VERSION_FILE, this.generateNewVersionFile(), {replace: true,spaces: 2}, (err) => {
        console.error(errorize('2'))
        console.error(errorize(err))
      });
      BUILD_HISTORY.unshift({
        timestamp: Date.now(),
        jsVersion: this.jsVersion,
        appVersion: APP_VERSION,
        build: this.buildNumber
      })
      jsonfile.writeFileSync(HISTORY_FILE, {builds: BUILD_HISTORY}, {replace: false,spaces: 2});

      console.log(success(`|> NOW ON VERSION ${this.jsVersion}`))

      if(!opts.dist){
        resolve(this.cleanUp())
      }else{
        resolve(true)
      }

    })
  }

  deploy(opts={}){

    console.log(bg(`Deploy time! (${ENV})`));

    if(ENV == 'production'){
      var deploy = () => {

        const firechild = exec(`cd ${DIR}/AutoUpdater; firebase deploy:hosting --non-interactive; cd ${DIR}`)

        firechild.stdout.on('data', (data) => console.log(chalk.magenta('|> ') + data));

        firechild.stderr.on('data', (data) => console.log(chalk.white('|> ') + data));

        firechild.on('close', (code) => {
          console.log(chalk.yellow(`|> PACKAGER FINISHED`));

          console.log(chalk.yellow(`|> firechild process exited with code ${code}`));
          if(!opts.dist){
            this.cleanUp()
          }else{
            console.log(success('△△△△△ DIST BUILD COMPLETE! △△△△△'));
            this.cleanUp()
            return
          }
        });

        firechild.on('error', (err) => {
          console.log(errorize('Failed to start firechild process.'));
          console.log(errorize('firebase err',JSON.stringify(err),err))
          throw err

        });
      }

    }else{
      console.log(errorize(`local deploying:\n ${bg(this.updateJson)}`));
    }
    // Copy bundle to local firebase public dir
    fs.copy(this.getUniqueFilename(), this.getUpdateDotJsonPath(), { replace: false }, (err) => {
      if (err) { // i.e. file already exists or can't write to directory
        console.error(errorize(err));
        throw err;
      }

      console.log(success(`Copied ${this.getUniqueFilename()} to ${this.getUpdateDotJsonPath()}`));

      // Move bundle extra bundle to bundles/
      fs.move(this.getUniqueFilename(), this.getBackupPath()+this.getUniqueFilename(), (err) => {
        if (err) { // i.e. file already exists or can't write to directory
          console.error(errorize(err));
          throw err;
        }
        console.log(success(`Copied ${this.getUpdateDotJsonPath()} to ${this.getBackupPath()+this.getUniqueFilename()}`));

        if(deploy){
          deploy();
        }else{
          console.log(success('△△△△△ DIST BUILD COMPLETE! △△△△△'));
          this.cleanUp()
          return
        }

      })
    })
  }

  rollback(){
    this.compile({rollback:true})
  }

  dist(ask){
    var run = {dist:true};

    if(!ask){
      this.bump(run).then((r)=> this.compile(run)).then((r2) => this.deploy(run) ).catch((err)=>{
        console.error('program failure',error(err));
      })
    }else{
      program.confirm('△△△△△ BUMP VERSION, COMPILE, AND DEPLOY? △△△△△', (ok) => {
        if(ok){
          this.bump(run).then((r)=> this.compile(run)).then((r2) => this.deploy(run) ).catch((err)=>{
            console.error('program failure',error(err));
          })
        }
      });
    }
  }

  cleanUp(){
    this.presentChoice()
  }
}

/*** do it ***/
const T3 = new TripppleTools();

{
  chalk.bgMagenta(() =>{
    console.log(bg(`App Version: ${APP_VERSION} △△△△△`));
    console.log(bg(`JS Version: ${JS_VERSION} △△△△△`));
    console.log(bg(`Last JS Build #: ${LAST_BUILD_NUMBER} △△△△△`));
  })
  program.version(APP_VERSION)



  program
  .command('dist')
  .description('compile, bump version, and deploy')
  .action( (env) => {
    T3.dist();

  });

  program
  .command('history')
  .description('show history')
  .action( (cmd, options)=>{

  })


  program
  .command('*')
  .description('compile, bump version, and deploy')
  .action( (cmd, options)=>{
    T3.init();
  })
  .on('--help', () => {
    console.log('Deploy OTA update to Trippple client.');
    console.log('Examples:');
    console.log('');
    console.log('    $ npm run autoupdate');
    console.log('    $ ./bin/deploy-ota.js dammit');
    console.log('');
  });

  program.parse(process.argv);
}