var wd = require("wd");
require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
exports.should = should;

// var child_process = require('child_process');

// var appiumProc    = child_process.spawn('appium', ['-p', '4725']);
// var loadedAppium = false;
// var appiumPromise = new Promise(function (resolve, reject) {
//   appiumProc.stdout.on('data', function (data) {
//     if (loadedAppium) return;
//     console.log('APPIUM: ' + data);
//
//     if (data.indexOf('Appium REST http interface listener started') >= 0) {
//       loadedAppium = true;
//       resolve(data);
//     }
//   });
// });
//
// appiumProc.stderr.on('data', function (data) {
//   console.log('APPIUM err: ' + data);
//   appiumProc.kill();
// });
// process.on('exit', function () {
//   appiumProc.kill();
// });
//
