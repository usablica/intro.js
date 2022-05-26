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
});
