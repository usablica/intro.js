context("Hints Modal", () => {
  it("should be able to open and close hint modals", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs();

      instance.showHints();

      cy.get(".introjs-hint").first().click();

      cy.get(".introjs-tooltip").should("have.length", 1);
      cy.get(".introjs-tooltip").contains("fixed header");

      cy.get(".introjs-button").click();

      cy.get(".introjs-tooltip").should("have.length", 0);
    });
  });

  it("should display the correct modal content", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs();

      instance.showHints();

      cy.get(".introjs-hint").first().click();

      cy.get(".introjs-tooltip").contains("fixed header");

      cy.get(".introjs-hint").eq(1).click();

      cy.get(".introjs-tooltip").contains("a button");

      cy.get(".introjs-hint").eq(2).click();

      cy.get(".introjs-tooltip").contains("secondary header");

      cy.get(".introjs-hint").eq(3).click();

      cy.get(".introjs-tooltip").contains("this is the footer");
    });
  });

  it("clicking on the same hint should close the modal", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs();

      instance.showHints();

      for (let i = 0; i < 3; i++) {
        cy.get(".introjs-hint").first().click();

        cy.get(".introjs-tooltip").contains("fixed header");

        cy.get(".introjs-hint").first().click();

        cy.get(".introjs-tooltip").should("not.exist");
      }
    });
  });
});
