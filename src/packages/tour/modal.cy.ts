context("Modal", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should match the popup", () => {
    cy.window().then((win) => {
      win.introJs
        .tour()
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

      cy.wait(500);

      cy.compareSnapshot("first-step");

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("second-step");

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("exit");
    });
  });

  it("should set the position", () => {
    cy.window().then((win) => {
      cy.viewport("macbook-13");

      win.introJs
        .tour()
        .setOptions({
          steps: [
            {
              element: "#main-card",
              intro: "position bottom",
              position: "bottom",
            },
            {
              element: "#clickable-button",
              intro: "position right",
              position: "right",
            },
            {
              element: "#clickable-absolute-button",
              intro: "position left",
              position: "left",
            },
          ],
        })
        .start();

      cy.wait(800);
      cy.compareSnapshot("position-bottom");

      cy.nextStep();
      cy.wait(500);
      cy.compareSnapshot("position-right");

      cy.nextStep();
      cy.wait(500);
      cy.compareSnapshot("position-left");
    });
  });

  it("should update the modal after refresh(true)", () => {
    cy.viewport("macbook-13");
    cy.window().then((win) => {
      const instance = win.introJs.tour().setOptions({
        showProgress: true,
        showBullets: true,
        steps: [
          {
            element: "#main-card",
            intro: "step one",
          },
          {
            element: "#clickable-button",
            intro: "step two",
          },
        ],
      });

      instance.start();

      cy.wait(800).then(() => {
        cy.compareSnapshot("refresh-first-step");
        cy.nextStep();

        cy.wait(500).then(() => {
          cy.compareSnapshot("refresh-second-step");

          cy.wait(500).then(() => {
            instance
              .setOptions({
                steps: [
                  {
                    element: "#main-card",
                    intro: "step one",
                  },
                  {
                    element: "#clickable-button",
                    intro: "step two",
                  },
                  {
                    element: "#clickable-absolute-button",
                    intro: "step three",
                  },
                ],
              })
              .refresh(true);

            cy.nextStep();
            cy.wait(500);
            cy.compareSnapshot("refresh-third-step");
          });
        });
      });
    });
  });

  it("should apply tooltipClass from step configuration over tour tooltipClass", () => {
    cy.visit("./cypress/setup/index.html").then((win) => {
      cy.viewport("macbook-13");

      const instance = win.introJs.tour().setOptions({
        tooltipClass: "tour-tooltip",
        steps: [
          {
            element: "#main-card",
            intro: "step tooltip class",
            tooltipClass: "step-tooltip",
          },
        ],
      });
      instance.refresh(true);
      instance.start();

      cy.get(".introjs-tooltip")
        .should("have.class", "step-tooltip")
        .should("not.have.class", "tour-tooltip");
    });
  });
});
