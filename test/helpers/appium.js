var wd = require("wd");
require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
exports.should = should;


// // #IPROMISE -----------------
// require('colors');
// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// global.expect = chai.expect;
// var should = chai.should();
// var bootAppium = require('./driver');
//
// var resetEachTime = false;
//
// // GLOBAL TRACKING -----------------
// var rootDriver = null;
//
// var allPassed = true;
// var timeoutTime = 300000;
//
// var resetSimulator = function(callback) {
//   if (!rootDriver) {
//     callback(true);
//     return;
//   }
//
//
//
//   rootDriver.run(async function () {
//     // wait for it to show up from appium
//     var i = 0;
//     while (i < 50) {
//       try {
//         // best-case first
//         // reset data
//         await rootDriver.elementById('ResetTest').click();
//         break;
//       }
//       catch (e) { }
//
//       try {
//         // if on crashed (red) app
//         await rootDriver.elementById('redbox-reload').click();
//       }
//       catch (e) { }
//
//       try {
//         // is there an alert?
//         await rootDriver.elementByName('OK').click();
//       }
//       catch (e) { }
//
//       try {
//         // now does it work?
//         // reset data
//         await rootDriver.elementById('ResetTest').click();
//         break;
//       }
//       catch (e) { }
//
//       try {
//         // ok, fine. shake it and click reload
//         await rootDriver.shake();
//         await rootDriver.elementById('Reload').click();
//       }
//       catch (e) { }
//
//       // wait for a bit
//       await rootDriver.sleep(250);
//       i++;
//     }
//
//     if (i >= 50) {
//       // it's not coming back
//       console.log("SIMULATOR DIED");
//       callback(true);
//     }
//     else {
//       callback(false);
//     }
//   // callback(true)
//   });
//
// };
//
// var launchSimulator = function(callback) {
//   bootAppium(function(options) {
//     rootDriver  = options.driver;
//     realWd      = options.realWd;
//     wd          = options.wd;
//
//     console.log(options,"booted!")
//
//     chaiAsPromised.transferPromiseness = realWd.transferPromiseness;
//
//     resetSimulator(callback);
//   });
// };
//
// var quitSimulator = function(callback) {
//   if (!rootDriver) {
//     callback();
//   }
//   else {
//     rootDriver.run(async function () {
//       console.log("quitting");
//       try {
//         await rootDriver.quit();
//         console.log("quit");
//       }
//       catch(e) {
//         console.log("ERROR quitting: " + e);
//       }
//
//       rootDriver = null;
//       callback();
//     });
//   }
// };
//
// // BEFORE ENTIRE SUITE -----------------
//
// before(function (done) {
//   console.log("before suite");
//   this.timeout(timeoutTime);
//   done();
// });
//
// // AFTER ENTIRE SUITE -----------------
//
// after(function (done) {
//   this.timeout(timeoutTime);
//   console.log("after suite");
//   quitSimulator(function() {
//     done();
//   });
// });
//
// // BEFORE EACH TEST -----------------
//
// var testCount = 0;
// beforeEach(function (done) {
//   this.timeout(timeoutTime);
//   testCount++;
//   console.log("before each: " + testCount);
//   console.log("beforeEach");
//   resetSimulator((error,x)=> {
//     console.log(error,x)
//     if (error) {
//       console.log(JSON.stringify(error),"ERRRRRRORRRR; will quit");
//       quitSimulator(()=> {
//         launchSimulator((err)=> {
//           if (err) {
//             console.log(JSON.stringify(err),"ERRRRRRRRR");
//
//             throw ("unable to launch simulator");
//           }
//           else {
//             done();
//           }
//         });
//       });
//     } else {
//       done();
//     }
//   });
//
// });
//
// // AFTER EACH TEST -----------------
//
// afterEach(function(done) {
//   this.timeout(timeoutTime);
//   console.log("afterEach");
//   allPassed = allPassed && this.currentTest.state === 'passed';
//
//
//   if (resetEachTime) {
//     quitSimulator(function() {
//       done();
//     });
//   }
//   else {
//     done();
//   }
// });
//
// // EXPORT HELPER -----------------
//
// // override "it" to remove test boilerplate
// var newIt = function(name, callback) {
//   it(name, function(done) {
//     this.timeout(timeoutTime);
//     rootDriver.run(async function () {
//       await callback(rootDriver, done)
//     });
//   });
// };
//
// // override "it" to remove test boilerplate
// var itOnly = function(name, callback) {
//   it.only(name, function(done) {
//     this.timeout(timeoutTime);
//     rootDriver.run(async function () {
//       await callback(rootDriver, done)
//     });
//   });
// };
//
// // override "it" to remove test boilerplate
// var itPending = function(name, callback) {
//   it.skip(name, function(done) {
//     this.timeout(timeoutTime);
//     rootDriver.run(async function () {
//       await callback(rootDriver, done)
//     });
//   });
// };
//
// export default newIt;
// export {itOnly, itPending};
