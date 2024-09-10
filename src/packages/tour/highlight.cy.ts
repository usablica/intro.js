context("Highlight", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should highlight the target element", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              intro: "step one",
            },
            {
              element: "#clickable-button",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("highlight-element-first-step");

      cy.nextStep();

      cy.wait(800);

      cy.compareSnapshot("highlight-element-second-step");
    });
  });

  it("should let user interact with the target element", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              intro: "step one",
            },
            {
              element: "#clickable-button",
              intro: "step two",
            },
          ],
        })
        .start();

      let sp = cy.spy(window, "click");

      cy.nextStep();
      cy.wait(500);
      cy.get(".introjs-tooltiptext").contains("step two");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-button").contains("Hovered");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.be.calledOnce);
    });
  });

  it("interaction with the target element should be disabled when disabledInteraction is true", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          disableInteraction: true,
          steps: [
            {
              element: "#clickable-button",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);
      let sp = cy.spy(window, "click");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-button").contains("Example button");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.not.be.called);
    });
  });

  it("should interaction with the target element the parent element has positive: relative", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#clickable-relative-button",
              intro: "step two",
            },
          ],
        })
        .start();

      let sp = cy.spy(window, "clickRelative");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-relative-button").contains("Hovered Relative");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.be.calledOnce);
    });
  });

  it("should not be able to interaction with the target element the parent element has positive: relative and z-index", () => {
    cy.window().then((window) => {
      // related issue: https://github.com/usablica/intro.js/issues/1202
      cy.get("#relative-parent").invoke(
        "attr",
        "style",
        "z-index: 1;position: relative;"
      );

      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#clickable-relative-button",
              intro: "step two",
            },
          ],
        })
        .start(); 

      cy.wait(500);

      let sp = cy.spy(window, "clickRelative");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-button").contains("Example button");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.not.be.called);
    });
  });

  it("should interaction with the target element the parent element has positive: absolute", () => {
    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#clickable-absolute-button",
              intro: "step two",
            },
          ],
        })
        .start();

      let sp = cy.spy(window, "clickAbsolute");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-absolute-button").contains("Hovered Absolute");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.be.calledOnce);
    });
  });

  it("should not be able to interaction with the target element the parent element has positive: absolute and z-index", () => {
    cy.window().then((window) => {
      // related issue: https://github.com/usablica/intro.js/issues/1202
      cy.get("#absolute-parent").invoke(
        "attr",
        "style",
        "z-index: 1;position: absolute;"
      );

      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#clickable-absolute-button",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      let sp = cy.spy(window, "clickAbsolute");

      cy.get(".introjs-helperLayer").realHover();
      cy.get("#clickable-button").contains("Example button");

      cy.get(".introjs-helperLayer")
        .realClick()
        .then(() => expect(sp).to.not.be.called);
    });
  });

  it("should highlight a fixed element correctly", () => {
    cy.viewport(550, 750);

    cy.window().then((window) => {
      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#fixed",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("highlight-fixed-element", {
        capture: "viewport"
      });
    });
  });

  it("should highlight a fixed element correctly after scroll", () => {
    cy.viewport(550, 750);

    cy.window().then((window) => {
      window.scrollTo({
        top: 200,
      });

      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#fixed",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("highlight-fixed-element-scroll", {
        capture: "viewport"
      });
    });
  });

  it("should highlight a fixed parent element correctly after scroll", () => {
    cy.viewport(550, 750);

    cy.window().then((window) => {
      window.scrollTo({
        top: 200,
      });

      window.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#fixed-parent",
              intro: "step two",
            },
          ],
        })
        .start();

      cy.wait(500);

      cy.compareSnapshot("highlight-fixed-parent-element-scroll", {
        capture: "viewport"
      });
    });
  });
});
