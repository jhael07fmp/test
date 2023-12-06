const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const { describe, it } = require("mocha");
const assert = require("assert");
// describe
describe("Login and Register tests", async () => {
  it("should register the user successfully", async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
      await driver.get("https://selenium-test.vercel.app/register");

      for (const { id, value } of registerInputsData) {
        await driver.findElement(By.id(id)).sendKeys(value);
      }

      await driver.findElement(By.className("session-card__button")).click();

      const result = await driver.findElement(By.id("swal2-html-container")).getText();

      driver.takeScreenshot().then((image) => {
        fs.writeFile("registerTest1.png", image, "base64", (err) => {
          if (err) console.log(err);
        });
      });

      await driver.actions().keyDown(Key.ESCAPE).perform();

      const logoutButton = await driver.wait(until.elementLocated(By.id("logout-btn")), 10000);
      await driver.wait(until.elementIsVisible(logoutButton), 10000);
      await logoutButton.click();

      if (result === "User successfully created") {
        assert.strictEqual(
          result,
          "User successfully created",
          "Registration Test Passed! ✅ User was created successfully"
        );
      } else {
        throw new Error(`Registration Test Failed! ⛔ `);
      }
    } catch (err) {
      throw err;
    } finally {
      await driver.quit();
    }
  });

  it("should not register the user", async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://selenium-test.vercel.app/register");
    try {
      for (let i = 0; i < registerFailureInputData.length; i++) {
        registerFailureInputData[i].forEach(
          async ({ id, value }) => await driver.findElement(By.id(id)).sendKeys(value)
        );

        await driver.findElement(By.className("session-card__button")).click();

        const result = await driver.findElement(By.id("swal2-html-container")).getText();

        driver
          .takeScreenshot()
          .then((image) => fs.writeFile("registerTest2.png", image, "base64", (err) => {}));
        await driver.actions().keyDown(Key.ESCAPE).perform();

        if (result !== "User successfully created")
          assert.notEqual(
            result,
            "User successfully created",
            `${i + 1}: Registration Test Passed! ✅ user was not created as expected`
          );
        else throw new Error("Registration Test Failed! ⛔");

        registerFailureInputData[i].forEach(
          async ({ id }) => await driver.findElement(By.id(id)).clear()
        );
      }
    } catch (err) {
      console.log("Error in Register test", err);
    }
  });

  it("should login and go to home page", async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    let result = "";
    try {
      await driver.get("https://selenium-test.vercel.app/register");

      for (const { id, value } of registerInputsData) {
        await driver.findElement(By.id(id)).sendKeys(value);
      }

      await driver.findElement(By.className("session-card__button")).click();

      const result = await driver.findElement(By.id("swal2-html-container")).getText();

      await driver.actions().keyDown(Key.ESCAPE).perform();

      const logoutButton = await driver.wait(until.elementLocated(By.id("logout-btn")), 10000);
      await driver.wait(until.elementIsVisible(logoutButton), 10000);
      await logoutButton.click();

      await driver.findElement(By.id(loginInputsData[0].id)).sendKeys(loginInputsData[0].value);
      await driver.findElement(By.id(loginInputsData[1].id)).sendKeys(loginInputsData[1].value);

      await driver.findElement(By.className("session-card__button")).click();

      const modal = await driver.findElement(By.id("swal2-html-container"));

      if (modal) {
        result = await modal.getText();
      }
      switch (result) {
        case "Username or password invalid":
          throw new Error("Login Test Failed! ⛔ Username or password invalid");

        case "Password is required":
          throw new Error("Login Test Failed! ⛔ Password is required");

        case "Username is required":
          throw new Error("Login Test Failed! ⛔ Username is required");
      }
    } catch (err) {
      if (err.name === "NoSuchElementError") {
        assert.equal(result, "", "Login Test Passed! ✅");
        driver
          .takeScreenshot()
          .then((image) => fs.writeFile("loginTest.png", image, "base64", (err) => {}));
        return;
      }
      throw err;
    } finally {
      await driver.quit();
    }
  });
});

// it

// Function to execute all test scenarios
const executeTests = async () => {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    test("Should register user", async () => {
      await RegisterTest(driver);
    });
    await RegisterFailureTest(driver);
    await loginTest(driver);
  } catch (err) {
    console.log("Error", err);
  }
};

// // Execute all tests
// executeTests();

const registerInputsData = [
  { id: "name", value: "Jhael Rodríguez" },
  { id: "username", value: "jhael" },
  { id: "password", value: "Jehlicot07.com" },
];

const registerFailureInputData = [
  [
    { id: "name", value: "" },
    { id: "username", value: "" },
    { id: "password", value: "" },
  ],
  [
    { id: "name", value: "jhael" },
    { id: "username", value: "" },
    { id: "password", value: "" },
  ],
  [
    { id: "name", value: "jhael" },
    { id: "username", value: "jhael" },
    { id: "password", value: "" },
  ],
  [
    { id: "name", value: "jhael" },
    { id: "username", value: "jhael" },
    { id: "password", value: "jhael" },
  ],
];

const loginInputsData = [
  { id: "username", value: "jhael" },
  { id: "password", value: "Jehlicot07.com" },
];
