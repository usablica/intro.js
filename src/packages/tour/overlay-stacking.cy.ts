context("Overlay stacking", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");

    // a page element with its own stacking context (position + a positive
    // z-index), same shape as a real sticky header/nav - unrelated to the
    // tour itself
    cy.document().then((doc) => {
      const el = doc.createElement("div");
      el.id = "zindex-page-element";
      el.style.cssText =
        "position: relative; z-index: 1; height: 60px; background: crimson;";
      doc.body.prepend(el);
    });
  });

  // https://github.com/usablica/intro.js/issues/2134
  it("should stay above a page element with its own z-index while fading in", () => {
    cy.window().then((window) => {
      window.introJs.tour().start();

      // sample partway through the tour's 300ms fade-in transition
      cy.wait(100);

      cy.window().then((win) => {
        const el = win.document.getElementById("zindex-page-element")!;
        const rect = el.getBoundingClientRect();
        const hit = win.document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );

        expect(hit?.id).not.to.equal("zindex-page-element");
      });
    });
  });

  it("should still let the highlighted target stay interactive once the tour is visible", () => {
    // guards against a wrapper-level z-index fix regressing the target's
    // own z-index boost (`.introjs-showElement`) - see highlight.cy.ts
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [{ element: "#clickable-button", intro: "step" }],
        })
        .start();

      cy.wait(500);

      cy.window().then((win) => {
        const btn = win.document.getElementById("clickable-button")!;
        const rect = btn.getBoundingClientRect();
        const hit = win.document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );

        expect(hit).to.equal(btn);
      });
    });
  });
});
