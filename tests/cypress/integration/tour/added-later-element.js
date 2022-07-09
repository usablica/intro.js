context("Added later element", () => {
  const addedLaterElId = "later_added";
  const stepOneText = "step one";
  const stepTwoText = "step two, click on create btn";
  const stepThreeText = "added later element";
  const createDivBtnSelector = "#create-div-button";
  beforeEach(() => {
    cy.visit("./cypress/setup/create_div_btn.html").then((window) => {
      window
        .introJs()
        .setOptions({
          disableInteraction: false,
          steps: [
            {
              intro: stepOneText,
            },
            {
              intro: stepTwoText,
              element: createDivBtnSelector,
            },
            {
              intro: stepThreeText,
              element: "#" + addedLaterElId,
            },
          ],
        })
        .start();
    });
  });

  it("should find by selector and highlight added later element", () => {
    cy.get(".introjs-tooltiptext").contains(stepOneText);
    cy.nextStep();
    cy.get(".introjs-tooltiptext").contains(stepTwoText);
    cy.wait(500);
    cy.get(createDivBtnSelector).click();
    cy.nextStep();
    cy.wait(500);
    cy.get("#" + addedLaterElId)
      .filter(".introjs-showElement")
      .contains("Later added div");
    cy.wait(2000);
    cy.compareSnapshot("added-later-element-end", 0.05);
    cy.doneButton();
    cy.get(".introjs-showElement").should("not.exist");
  });
});
