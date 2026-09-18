context("Tooltip visibility", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  // https://github.com/usablica/intro.js/issues/2081
  // https://github.com/usablica/intro.js/issues/2080 (same root cause)
  it("should keep the tooltip visible on every step, not just the first", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            { intro: "step one" },
            { intro: "step two" },
            { intro: "step three" },
          ],
        })
        .start();

      cy.wait(500);
      cy.get(".introjs-tooltip").should("be.visible");

      cy.nextStep();
      cy.wait(500);
      cy.get(".introjs-tooltip").should("be.visible");

      cy.nextStep();
      cy.wait(500);
      cy.get(".introjs-tooltip").should("be.visible");
    });
  });

  it("should not make the (larger, differently-positioned) tooltip reference layer itself interactive", () => {
    // guards against the regression reported in the same issue: forcing
    // `.introjs-tooltipReferenceLayer` (rather than just `.introjs-tooltip`)
    // visible fixes the tooltip but makes its whole bounding box - which
    // can be larger than, and positioned differently from, the tooltip -
    // swallow clicks meant for the page underneath it.
    cy.window().then((window) => {
      window.introJs.tour().start();

      cy.wait(500);

      cy.window().then((win) => {
        const ref = win.document.querySelector(
          ".introjs-tooltipReferenceLayer"
        )!;
        const tooltip = win.document.querySelector(".introjs-tooltip")!;
        const refRect = ref.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // a point inside the reference layer's box, just outside the
        // tooltip's own box
        const x = refRect.left + 2;
        const y = refRect.top + 2;
        const isInsideTooltip =
          x >= tooltipRect.left &&
          x <= tooltipRect.right &&
          y >= tooltipRect.top &&
          y <= tooltipRect.bottom;

        // only meaningful if the fixture actually produced a reference
        // layer bigger than the tooltip - true today, but guard against a
        // future layout change silently making this a no-op assertion
        expect(
          isInsideTooltip,
          "reference layer must be larger than the tooltip for this test to be meaningful"
        ).to.be.false;

        const hit = win.document.elementFromPoint(x, y);
        expect(hit).not.to.equal(ref);
      });
    });
  });
});
