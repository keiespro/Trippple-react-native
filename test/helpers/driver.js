"use strict";
require("./appium");
var wd = require("wd"),
_ = require('lodash'),
Promise = require('bluebird'),
serverConfigs = {
  host: '0.0.0.0', //Your  IP address
  port: 4723
};
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


var caps = {
  browserName: '',
  'appium-version': '1.5.0',
  locationContextEnabled:'true',
  platformName: 'iOS',
  networkConnectionEnabled: 'true',
  // platformVersion: '9.3',
  deviceName: "iPhone 5s",//"[B84045D3-3987-43AD-B645-4614B2AC5C7A]",// 'iPhone 5',
  // autoLaunch: 'true',
//  newCommandTimeout: UNLIMITED,
app:"/Users/alexlopez/code/Trippple/Trippple/ios/Build/Build/Products/Debug-iphonesimulator/Trippple.app",
  // bundleId:"co.trippple"
  // app: "/Users/alexlopez/code/Trippple/Trippple/ios/Build/Products/Debug-iphoneos/Trippple.app"
};

describe("Node Sample Automation Code", function() {
  this.timeout(3000000);
  var allPassed = true;
  var serverConfig = serverConfigs;
  var driver = wd.promiseChainRemote(serverConfig);
  require("./logging").configure(driver);
  var desired = caps;

  before(()=> {

    return driver
        .init(desired)
  });
  after(()=> {
    // let driver = driver || wd.promiseChainRemote(serverConfig);
    return driver
      .sleep(3000)
      // .quit()
      .finally(()=> {

      });
  });
afterEach(()=> {
    allPassed =  false;// && this.currentTest.state === 'passed';
});

it("Should log in with phone number", ()=>{
  // return driver.sleep(5000)
    // driver.waitForElementById(" LOG IN",15000).click().sleep(500)
    // var login =
    return driver.elementById(" LOG IN")
            .then( (el) => {

                var touchit = new wd.TouchAction();
                 touchit.tap({el: el});
                 el.click()
                 driver.sleep(5000)
                 driver.elementById('  3').click().sleep(500)
                 driver.elementById("  0").click().sleep(500)
                 driver.elementById("  5").click().sleep(500)
                 driver.elementById("  5").click().sleep(500)
                 driver.elementById("  2").click().sleep(500)
                 driver.elementById("  8").click().sleep(500)
                 driver.elementById("  2").click().sleep(500)
                 driver.elementById("  5").click().sleep(500)
                 driver.elementById("  3").click().sleep(500)
                 driver.elementById("  4").click().sleep(500)
                 driver.elementById("  CONTINUE").click()

                 return driver.sleep(10000)

             })
    // .fin(function() { return driver.sleep(1000).quit().nodeify(done); })
    // Use Appium inspector for inspecting elements

});


});
//
// // require('./packager');
//
// // APPIUM -----------------
// var child_process = require('child_process');
// var appiumProc    = child_process.spawn('appium', ['-p', '4724']);
// var Promise       = require('bluebird');
//
// var server = {
//   host: 'localhost',
//   port: 4724 // one off from normal
// };
//
//
//
// var loadedAppium = null;
//
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
// // WD -----------------
//
// var realWd = require("wd");
// var wd     = require("yiewd");
// var color  = require('colors');
//
// // KOA -----------------
//
//
// // Config for Appium
//
// var UNLIMITED = 100000;
//
// var caps = {
//   browserName: '',
//   'appium-version': '1.5.0',
//   locationContextEnabled:'true',
//   platformName: 'iOS',
//   networkConnectionEnabled: 'true',
//   platformVersion: '9.3',
//   deviceName: 'iPhone 5',
//   // autoLaunch: 'true',
// //  newCommandTimeout: UNLIMITED,
//   app: "/Users/alexlopez/code/Trippple/Trippple/ios/Build/Build/Products/Debug-iphonesimulator/Trippple.app"
// };
//
// module.exports = function(callback) {
//   console.log("DRIVER: starting it up");
//
//   appiumPromise.then(function () {
//     console.log("DRIVER: will init");
//     const driver = wd.remote(server);
//
//     driver.on('status', function(info) {
//       console.log(info.cyan);
//     });
//     driver.on('command', function(meth, path, data) {
//       console.log(' > ' + meth.yellow, path.grey, data || '');
//     });
//
//     var current = {};
//
//     const handler = function(error, el){
//       if (error) {
//         console.log('error', error);
//       }
//       else if(typeof el === 'object'){
//         console.log("Returned in current");
//         current = el;
//       }
//       else {
//         console.log("Returned following string", el);
//       }
//
//     };
//
//     const quit = function(){
//       driver.quit(function(){
//         process.exit(1);
//       });
//     };
//
//     driver.init(caps, function(){
//       console.log('driver started');
//       callback({
//         driver: driver,
//         realWd: realWd,
//         wd: wd,
//       });
//     });
//   });
// };
