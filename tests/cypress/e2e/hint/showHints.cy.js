context("ShowHints", () => {
  it("should render all hints using the data-hint attributes", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs();

      instance.showHints();

      cy.get(".introjs-hint").should("have.length", 4);
    });
  });

  it("should render all hints on the page with the given JSON options", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs().setOptions({
        hints: [
          {
            element: "#fixed-parent",
            hint: "header element",
          },
          {
            element: "#clickable-button",
            hint: "main button",
          },
          {
            element: "#relative-parent",
            hint: "relative parent",
          },
        ],
      });

      instance.showHints();

      cy.get(".introjs-hint").should("have.length", 3);
    });
  });

  it("should prefer JSON options over data-hint attributes", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs().setOptions({
        hints: [
          {
            element: "#fixed-parent",
            hint: "header element",
          },
        ],
      });

      instance.showHints();

      cy.get(".introjs-hint").should("have.length", 1);
    });
  });
});
