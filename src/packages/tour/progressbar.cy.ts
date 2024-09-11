context("ProgressBar", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should match the popup", () => {
    cy.window().then((win) => {
      win.introJs
        .tour()
        .setOptions({
          showProgress: true,
          steps: [
            {
              intro: "step one",
            },
            {
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("first-step");

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("second-step");

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("exit");
    });
  });
});
