context("Start", () => {
  it("should not throw an exception after calling start mulitple times", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs().setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            intro: "step two",
          },
        ],
      });

      instance.start();
      instance.exit();
      instance.start();
      instance.exit();
      instance.start();
      instance.exit();
    });
  });
});
