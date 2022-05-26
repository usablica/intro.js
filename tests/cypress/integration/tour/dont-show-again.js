context("Don't show again checkbox", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
    cy.clearCookies();
  });

  it("should render the 'Dont show Again' checkbox", () => {
    cy.window().then((window) => {
      window
        .introJs()
        .setOptions({
          dontShowAgain: true,
          steps: [
            {
              intro: "step one",
            },
            {
              element: "#clickable-button",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("dont-show-again-checkbox-first-step", 0.05);

      cy.nextStep();

      cy.wait(800);

      cy.compareSnapshot("dont-show-again-checkbox-second-step", 0.05);
    });
  });

  it("should not display the tour if checkbox is clicked", () => {
    cy.window().then((window) => {
      const instance = window.introJs().setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "step one",
          },
          {
            element: "#clickable-button",
            intro: "step two",
          },
        ],
      });

      instance.start();

      cy.wait(500);

      cy.compareSnapshot("dont-show-again-clicked-first-step", 0.05);

      cy.get(".introjs-dontShowAgain input").click();

      cy.get(".introjs-skipbutton").click();

      cy.wait(800);

      cy.compareSnapshot("dont-show-again-clicked-after-exit", 0.05);

      instance.start();

      cy.wait(500);

      cy.compareSnapshot("dont-show-again-clicked-after-second-start", 0.05);
    });
  });
});
