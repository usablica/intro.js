context("Start", () => {
  it("should start the tour with data-intro attributes", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs();
      instance.start();

      cy.get(".introjs-tooltiptext").contains("first header step");
      cy.nextStep();
      cy.get(".introjs-tooltiptext").contains("second paragraph step");
      cy.nextStep();
      cy.get(".introjs-tooltiptext").contains("third header step");
      cy.nextStep();
      cy.get(".introjs-tooltiptext").contains("fourth header step");
      cy.nextStep();
      cy.get(".introjs-overlay").should("have.length", 0);
    });
  });

  it("should prefer tour configs over data-intro attributes", () => {
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

      cy.get(".introjs-tooltiptext").contains("step one");
    });
  });

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
