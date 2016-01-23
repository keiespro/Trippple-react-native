#! /usr/bin/env node


const VERSION = require('../.versionfile.json');


var jsonfile = require('jsonfile')





    var file = 'public/update.json'
    var filejson = {
      "version": VERSION,
      "minContainerVersion": "0",
      "url": {
        "url": "https://blistering-torch-607.firebaseapp.com/main.jsbundle",
        "isRelative": false
      }
    }

    jsonfile.writeFileSync(file, filejson, {spaces: 2});

