const compareSnapshotCommand = require("cypress-visual-regression/dist/command");

compareSnapshotCommand({
  capture: "fullPage",
});

Cypress.Commands.add("nextStep", () => {
  cy.get(".introjs-nextbutton").click();
});

Cypress.Commands.add("prevStep", () => {
  cy.get(".introjs-prevbutton").click();
});
