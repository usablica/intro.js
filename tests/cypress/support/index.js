// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.on("window:before:load", (win) => {
  const htmlNode = win.document.querySelector("html");
  const node = win.document.createElement("style");
  node.innerHTML = "html { scroll-behavior: inherit !important; }";
  htmlNode.appendChild(node);
});

import "cypress-real-events/support";
