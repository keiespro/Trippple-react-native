require("babel-polyfill");

describe("Welcome", () => {
  it("Should rock ",  function(driver, done) {
    var d =  driver()

    // launch(d);
    console.log(d)

  });

});


describe("Login", () => {
  console.log('LOAD TESTS')
  it("Should log in with phone number ", ()=> {

    driver.elementById(" LOG IN").click();
    driver.elementById("  3").click();
    driver.elementById("  0").click();
    driver.elementById("  5").click();
    driver.elementById("  5").click();
    driver.elementById("  2").click();
    driver.elementById("  8").click();
    driver.elementById("  2").click();
    driver.elementById("  5").click();
    driver.elementById("  3").click();
    driver.elementById("  4").click();
    return driver.elementById("  CONTINUE").click();
  });
});
