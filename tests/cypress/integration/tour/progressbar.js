context("ProgressBar", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should match the popup", () => {
    cy.window().then((win) => {
      win
        .introJs()
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

      cy.compareSnapshot("first-step", 0.05);

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("second-step", 0.05);

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("exit", 0.05);
    });
  });
});
