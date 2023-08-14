context("HideHints", () => {
  it("should hide all hints after calling hideHints()", () => {
    cy.visit("./cypress/setup/index.html").then(async (window) => {
      const instance = window.introJs();

      instance.showHints();

      cy.get(".introjs-hint").should("have.length", 4);

      await instance.hideHints();

      cy.get(".introjs-hint").should("have.length", 4);
      cy.get(".introjs-hint").each((x) =>
        cy.wrap(x).should("have.class", "introjs-hidehint")
      );
    });
  });
});
