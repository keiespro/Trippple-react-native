#! /usr/bin/env babel-node

import program from 'commander-plus';
import Promise from 'bluebird';
import chalk from 'chalk';
import jsonfile from 'jsonfile';
import firebaseTool from 'firebase-tools';
import fs from 'fs.extra';
import {exec} from 'child_process';

const NPM_CONFIG_PREFIX = process.env.npm_config_prefix || '';
const BUILD_NUMBER = '2';
const UPDATE_CHECK_FILE = 'AutoUpdater/public/update.json';
const APP_VERSION = '2.0';
const VERSION_FILE = '.versionfile.json';
const ENV = process.env.NODE_ENV || 'development';
const BASE_URLS = {
  development: 'http://x.local:5000',
  production: 'https://blistering-torch-607.firebaseapp.com'
}
const VERSION = jsonfile.readFileSync(VERSION_FILE);

// coloring
const error = chalk.bold.red;
const bg = chalk.bgMagenta;
const success = chalk.green;


class TripppleTools{

  constructor(){
    this.VERSION = VERSION;
    this.BUILD_NUMBER = BUILD_NUMBER;
  }

  init(){
    console.log(chalk.bgMagenta.bold('\nTrippple\n'));
    this.presentChoice()
  }

  getOutputFilename(){ return `main-${this.VERSION}-${BUILD_NUMBER}-${this.timestamp}.jsbundle`; }

  getOutputPath(){ return `AutoUpdater/public/${this.getOutputFilename()}` }

  getEnvironmentBaseUrl(){
    return BASE_URLS[ENV]
  }

  getBackupPath(){ return 'bundles/' }

  dev(){
    console.log(chalk.bgMagenta.yellow('\nServing update.json and compiled bundle\n'));
    firebaseTool.serve({host:'x.local'})
  }

  presentChoice(){

    let choiceList = ['dev', 'dist', 'compile', 'bump', 'deploy', 'rollback', 'exit'];


    program.choose(choiceList, (i) => {

      console.log(chalk.bgMagenta.bold('\n'+choiceList[i].toUpperCase()+'\n'));


      if(choiceList[i] == 'exit'){
        console.log(chalk.yellow('GOOD BYE\n'));
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

      const flags = `bundle --platform=ios --entry-file=index.ios.js --bundle-output=${this.getOutputFilename()} --verbose --assets-dest=./assets/ --project-root=./ --reset-cache=true`;

      const child = exec(`${NPM_CONFIG_PREFIX}/bin/react-native ${flags}`)

      child.stdout.on('data', (data) => console.log(chalk.cyan('|> ') + data));

      child.stderr.on('data', (data) => console.log(chalk.red('|> ') + data));

      child.on('close', (code) => {
        console.error(error(`child process exited with code ${code}`));
        if(!opts.dist){
          return resolve(this.cleanUp())
        }else{
          resolve()
        }
      });

      child.on('error', (err) => {
        console.log(error('Failed to start child process.'));
        return reject(this.cleanUp())
      });
    });
    }


  bump(opts={}){


    return new Promise((resolve, reject) => {

      console.log(bg('Bump JS version and regenerate update.json'))
      let V = VERSION;
      let pieces =  V.split('.')

      let bumped = parseInt(pieces.pop()) + (opts.rollback ? -1 : 1)
      let result = [...pieces,bumped].join('.')

      /* UPDATE.JSON TEMPLATE ----------------------------------------------------  */

      let updateCheckPayload = {
        "version": result,
        "minContainerVersion": APP_VERSION,
        "url": {
          "url": `${this.getEnvironmentBaseUrl()}/${this.getOutputFilename()}`,
          "isRelative": false
        }
      };

      /* END UPDATE.JSON TEMPLATE ------------------------------------------------- */

      console.log(`\n${success(this.getOutputFilename())} \n${updateCheckPayload} \n`)

      jsonfile.writeFileSync(UPDATE_CHECK_FILE, updateCheckPayload, {spaces: 2}, (err) => {
        console.error(error('1'))
        console.error(error(err))
      });

      jsonfile.writeFileSync(VERSION_FILE, result, {replace: true,spaces: 2}, (err) => {
        console.error(error('2'))
        console.error(error(err))
      });

      this.VERSION = result;

      console.log(success(`|> NOW ON VERSION ${this.VERSION}`))

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
      console.log(error(`firebase deploy  ${this.VERSION} ${this.timestamp}`));

      try {

        firebaseTool.deploy.hosting()

      } catch(err) {
        console.log(error(err))
        throw err
      }

    }else{
      console.log(error(`local deploy ${this.VERSION} ${this.timestamp}`));
    }

    // Copy bundle to local firebase public dir
    fs.copy(this.getOutputFilename(), this.getOutputPath(), { replace: false }, (err) => {
      if (err) { // i.e. file already exists or can't write to directory
        console.error(error(err));
        throw err;
      }

      console.log(success(`Copied ${this.getOutputFilename()} to ${this.getOutputPath()}`));

      // Move bundle extra bundle to ./bundles/
      fs.move(this.getOutputFilename(), this.getBackupPath()+this.getOutputFilename(), (err) => {
        if (err) { // i.e. file already exists or can't write to directory
          console.error(error(err));
          throw err;
        }
        console.log(success(`Copied ${this.getOutputPath()} to ${this.getBackupPath()+this.getOutputFilename()}`));

        if(!opts.dist){
          this.cleanUp()
        }else{
          console.log(success('DIST BUILD COMPLETE!'));
          this.cleanUp()
          return
        }

      })
    })
  }

  rollback(){
    this.compile({rollback:true})
  }

  dist(){

    program.confirm('Compile -> Bump -> Deploy. Do all 3?', (ok) => {
      if(ok){
        var run = {dist:true};
        this.compile(run).then((r)=> this.bump(run)).then((r2) => this.deploy(run) ).catch((err)=>{
          console.error('program failure',error(err));
        })
      }
    });
  }

  cleanUp(){
    this.presentChoice()
  }
}

/*** do it ***/
const T3 = new TripppleTools();

{
  T3.init();

  program
  .command('*')
  .on('--help', () => {
    console.log('Deploy OTA update to Trippple client.');
    console.log('Examples:');
    console.log('');
    console.log('    $ npm run autoupdate');
    console.log('    $ ./bin/deploy-ota.js dammit');
    console.log('');
  });

  program.version(APP_VERSION)
  program.parse(process.argv);
}
