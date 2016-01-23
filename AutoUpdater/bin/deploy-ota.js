#! /usr/bin/env node
import program from 'commander';
import { process } from "core-worker";


import Promise from 'bluebird';

var child;
import {terminal} from 'terminal-kit';
const term = terminal;

import jsonfile from 'jsonfile'

const T3 = new TripppleTools();

const APP_VERSION = '2.0.17';

program.version('0.0.1')

var jsonfile = require('jsonfile')

var util = require('util')

var file = '/.versionfile.json'


const VERSION =  jsonfile.readFileSync(file);
console.dir(VERSION)

const list = ['all', 'build', 'bump', 'deploy', 'exit'];
term.bold.underline.red('Trippple\n');
term.bold.underline.brightYellow('==============================================================\n');
term.bold.underline.brightYellow('==============================================================\n');

console.log('What do you want to do:');


program.choose(list, function(i){

  switch(list[i]){
    case 'exit':
      term.bold.underline.brightYellow('GOOD BYE\n');
      return;
      break;
    case 'all':
      T3.everything();
      break;
    case 'bump':
      T3.bump();
      break;
    case 'build':
      T3.build();
      break;
    case 'deploy':
      T3.deploy();
      break;
  }

  console.log('you chose %d "%s"', i, list[i]);
});



class TripppleTools{

  build(){
    // const proc = process(`./node_modules/react-native/packager/packager.sh bundle --platform=ios --entry-file=index.ios.js --bundle-output=main.jsbundle --verbose --assets-dest=./assets/newimg --project-root=./ --reset-cache=true`)
    // .then((error, stdout, stderr) {
    //   term.green('stdout: ' + stdout);
    //   term.red.error('stderr: ' + stderr);

    // })
    // .catch((error) =>{
    //   if (error !== null) {
    //     term.red.error('exec error: ' + error);
    //   }
    // })
  }

  bump(){
    term.red.error('bump version')

    const file = 'AutoUpdater/public/update.json'
    const filejson = {
      "version": APP_VERSION,
      "minContainerVersion": "0",
      "url": {
        "url": "https://blistering-torch-607.firebaseapp.com/main.jsbundle",
        "isRelative": false
      }
    }

    jsonfile.writeFileSync(file, filejson, {spaces: 2});

    return true;
  }

  deploy(){
    const timenow = new Date()

    term.bold.underline.red(`cd AutoUpdater && firebase deploy:hosting -m ${APP_VERSION} ${timenow}`);

    try {

      const proc = await process(`cd AutoUpdater && firebase deploy:hosting -m ${APP_VERSION} ${timenow}`)

      // work with result
    } catch(error) {
      if (error !== null) {
        term.bold.underline.brightYellow('==============================================================\n');
        term.bold.underline.red('exec error: ' + error);
        term.bold.underline.brightYellow('==============================================================\n');

      }
    }

  }

  everything(){

    this.build();
    this.bump();
    this.deploy();

  }
}




program
  .command('*')
  .on('--help', function(){
  term.bold.underline.red('Deploy OTA update to Trippple client.');
  term.green('  Examples:');
  console.log('');
  console.log('    $ npm run deploy-ota dammit');
  console.log('    $ ./bin/deploy-ota.js dammit');
  console.log('');
});


program.parse(process.argv);

