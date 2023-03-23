import "./commands";

Cypress.on("window:before:load", (win) => {
  const htmlNode = win.document.querySelector("html");
  const node = win.document.createElement("style");
  node.innerHTML = "html { scroll-behavior: inherit !important; }";
  htmlNode.appendChild(node);
});

import "cypress-real-events/support";
