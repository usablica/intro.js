context("Navigation", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      window
        .introJs()
        .setOptions({
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
    });
  });

  it("should go to the next step", () => {
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.nextStep();
    cy.get(".introjs-tooltiptext").contains("step two");
  });

  it("previous button should be disabled", () => {
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.get(".introjs-prevbutton").should("have.class", "introjs-disabled");
    cy.prevStep();
    cy.get(".introjs-tooltiptext").contains("step one");
  });

  it("should go to the previous step", () => {
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.nextStep();
    cy.get(".introjs-tooltiptext").contains("step two");
    cy.prevStep();
    cy.get(".introjs-tooltiptext").contains("step one");
  });

  it("should exit the tour after clicking on Done", () => {
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.nextStep();
    cy.get(".introjs-tooltiptext").contains("step two");
    cy.get(".introjs-donebutton").should("exist");
    cy.get(".introjs-donebutton").click();
    cy.get(".introjs-showElement").should("not.exist");
  });

  it("should close the tour after clicking on the exit button", () => {
    cy.get(".introjs-showElement").should("exist");
    cy.get(".introjs-skipbutton").click();
    cy.get(".introjs-showElement").should("not.exist");
  });

  it("should navigate by clicking on the bullet items", () => {
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.get(".introjs-bullets > ul > li:nth-child(1)").click();
    cy.get(".introjs-tooltiptext").contains("step one");
    cy.get(".introjs-bullets > ul > li:nth-child(2)").click();
    cy.get(".introjs-tooltiptext").contains("step two");
  });
});
