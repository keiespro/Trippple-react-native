import it, {itOnly} from '../helpers/appium';
import server from '../helpers/server';

describe("Welcome", () => {
  it("Should rock ", async function(driver, done) {

    launch(await driver);
    done();
  });

});


describe("Login", () => {
  var app = UIATarget.localTarget().frontMostApp();

  it("Should log in with phone number ", async function(driver, done) {

    var CurrentScreen = app.mainWindow().images()[0].images()[0];

    CurrentScreen[" LOG IN"].tap();
    CurrentScreen.elements().firstWithName("  3").tap();
    CurrentScreen.elements().firstWithName("  0").tap();
    CurrentScreen.elements().firstWithName("  5").tap();
    CurrentScreen.elements().firstWithName("  5").tap();
    CurrentScreen.elements().firstWithName("  2").tap();
    CurrentScreen.elements().firstWithName("  8").tap();
    CurrentScreen.elements().firstWithName("  2").tap();
    CurrentScreen.elements().firstWithName("  5").tap();
    CurrentScreen.elements().firstWithName("  3").tap();
    CurrentScreen.elements().firstWithName("  4").tap();
    CurrentScreen.elements()["  CONTINUE"].tap();

    done();
  });

});
