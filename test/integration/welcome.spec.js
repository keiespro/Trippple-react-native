require("babel-polyfill");

describe("Welcome", () => {



describe("Login", () => {
  it("Should log in with phone number ", ()=> {

    driver.elementById("LOG IN").click();
    driver.elementById("3").click();
    driver.elementById("0").click();
    driver.elementById("5").click();
    driver.elementById("5").click();
    driver.elementById("2").click();
    driver.elementById("8").click();
    driver.elementById("2").click();
    driver.elementById("5").click();
    driver.elementById("3").click();
    driver.elementById("4").click();
    return driver.elementById("CONTINUE").click();
  });
});
