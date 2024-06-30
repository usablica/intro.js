context("RemoveHints", () => {
  it("should remove all hints after calling removeHints()", () => {
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

      cy.get(".introjs-hint")
        .should("have.length", 3)
        .then(() => {
          instance.removeHints();

          cy.get(".introjs-hint").should("have.length", 0);
        });
    });
  });
});
