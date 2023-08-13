context("Exit", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should remove leftovers from the DOM", () => {
    cy.window().then((window) => {
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

      const selector = '[class^="intro"]';

      cy.get(selector).then((items) => {
        cy.wrap(items).its("length").should("be.gte", 1);

        instance.exit();

        cy.get(selector).should("have.length", 0);
      });
    });
  });

  it("should exit the tour after clicking on the skip icon", () => {
    cy.window().then((window) => {
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

      cy.wait(500);

      cy.get(".introjs-skipbutton").click();

      cy.wait(500);

      cy.get(".introjs-overlay").should("have.length", 0);
    });
  });

  it("should exit the tour after clicking on the overlay layer", () => {
    cy.window().then((window) => {
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

      cy.wait(500);

      cy.get(".introjs-overlay").click({ force: true });

      cy.wait(500);

      cy.get(".introjs-overlay").should("have.length", 0);
    });
  });

  it("should not exit the tour after clicking on the tooltip layer", () => {
    cy.window().then((window) => {
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

      cy.wait(500);

      cy.get(".introjs-tooltip").click({ force: true });

      cy.wait(500);

      cy.get(".introjs-overlay").should("have.length", 1);
    });
  });
});
