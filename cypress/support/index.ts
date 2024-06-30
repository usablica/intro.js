/// <reference types="./index.d.ts" />

import compareSnapshotCommand from "cypress-visual-regression/dist/command";

compareSnapshotCommand({
  capture: "fullPage",
});

Cypress.Commands.add("nextStep", () => {
  cy.get(".introjs-nextbutton").click();
});

Cypress.Commands.add("prevStep", () => {
  cy.get(".introjs-prevbutton").click();
});

Cypress.on("window:before:load", (win) => {
  const htmlNode = win.document.querySelector("html");
  const node = win.document.createElement("style");
  node.innerHTML = "html { scroll-behavior: inherit !important; }";
  htmlNode?.appendChild(node);
});

import "cypress-real-events/support";
