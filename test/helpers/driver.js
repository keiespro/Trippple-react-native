"use strict";
require("./appium");
var wd = require("wd"),
_ = require('lodash'),
Promise = require('bluebird'),
serverConfigs = {
  host: '0.0.0.0', //Your  IP address
  port: 4723
};
var UNLIMITED = 100000;

global.__TEST__ = false;

var caps = {
  browserName: '',
  'appium-version': '1.5.0',
  locationContextEnabled:'true',
  platformName: 'iOS',
  networkConnectionEnabled: 'true',
  // platformVersion: '9.3',
  deviceName: "iPhone 5s",//"[B84045D3-3987-43AD-B645-4614B2AC5C7A]",// 'iPhone 5',
  // autoLaunch: 'true',
  newCommandTimeout: UNLIMITED,
  app:"/Users/alexlopez/code/Trippple/Trippple/ios/Build/Build/Products/Debug-iphonesimulator/Trippple.app",
  // bundleId:"co.trippple"
  // app: "/Users/alexlopez/code/Trippple/Trippple/ios/Build/Products/Debug-iphoneos/Trippple.app"
};

describe("Welcome and login", function() {
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

    return driver.sleep(1000).elementById(" LOG IN")
            .then( (el) => {

                var touchit = new wd.TouchAction();
                 touchit.tap({el: el});
                 el.click()
                 return driver.elementById('  3').click().sleep(250)
                    .elementById("  0").click().sleep(250)
                    .elementById("  5").click().sleep(250)
                    .elementById("  5").click().sleep(250)
                    .elementById("  2").click().sleep(250)
                    .elementById("  8").click().sleep(250)
                    .elementById("  2").click().sleep(250)
                    .elementById("  5").click().sleep(250)
                    .elementById("  3").click().sleep(250)
                    .elementById("  4").click().sleep(250)
                    .elementById("  CONTINUE").click().sleep(5000)
                    .elementByClassName('UIATextField').should.eventually.exist.then((el)=>{
                       return driver.sleep(1000)

                     })
                    // .then( (el)=> {
                  //     return el
                  //       .sendKeys('1234')
                  //       .getValue().should.become('1234')
                  //       .elementByName('Done').click().sleep(1000); // dismissing keyboard
                  // })

                //  should.eventually.exist.then((el)=>{
                //    return driver.sleep(1000)
                 //
                //  })

             })
    // .fin(function() { return driver.sleep(1000).quit().nodeify(done); })
    // Use Appium inspector for inspecting elements

  });

  // it("Should onboard a new user", ()=>{
  //
  //   driver.elementById("    TRIPPPLE FOR SINGLES").click().sleep(500)
  //   driver.elementById(" No thanks").click().sleep(500)
  //   //
  //   // app.mainWindow().scrollViews()[0].textFields()[0].tap();
  //   // app.keyboard().typeString("Human")
  //   //
  //   //
  //   driver.elementById("  CONTINUE").click().sleep(500)
  //

  // .elementByIosUIAutomation('.elements().withName("Answer");')

  //   // app.mainWindow().pickers()[0].wheels()[2].scrollToVisible();
  //   // app.mainWindow().scrollViews()[0].dragInsideWithOptions({startOffset:{x:0.81, y:1.60}, endOffset:{x:0.88, y:0.94}});
  //   // app.mainWindow().pickers()[0].wheels().firstWithPredicate("value like '1985'").scrollToVisible();
  //
  //   driver.elementById("  CONTINUE").click().sleep(500)
  //   driver.elementById("  MALE").click().sleep(500)
  //   driver.elementById("  CONTINUE").click().sleep(500)
  //
  //   driver.elementById("   PUBLIC Your profile is visible to all Trippple members").click().sleep(500)
  //   driver.elementById("  CONTINUE").click().sleep(500)
  //   driver.elementById(" FROM ALBUM").should.eventually.exist
  //   return driver
  //   // app.mainWindow().elements()[" FROM ALBUM"].tapWithOptions({tapOffset:{x:0.41, y:0.54}});
  //   // app.mainWindow().scrollViews()[1].elements()[1].tapWithOptions({tapOffset:{x:0.40, y:0.43}});
  //   // app.mainWindow().elements()[2].tapWithOptions({tapOffset:{x:0.74, y:0.86}});
  //
  //
  // });
});
