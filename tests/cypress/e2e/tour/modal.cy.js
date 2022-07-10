context("Modal", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");
  });

  it("should match the popup", () => {
    cy.window().then((win) => {
      win
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

      cy.wait(500);

      cy.compareSnapshot("first-step", 0.05);

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("second-step", 0.05);

      cy.nextStep();
      cy.wait(800);

      cy.compareSnapshot("exit", 0.05);
    });
  });

  it("should set the position", () => {
    cy.window().then((win) => {
      cy.viewport("macbook-13");

      win
        .introJs()
        .setOptions({
          steps: [
            {
              element: "#main-section",
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
      cy.compareSnapshot("position-bottom", 0.05);

      cy.nextStep();
      cy.wait(500);
      cy.compareSnapshot("position-right", 0.05);

      cy.nextStep();
      cy.wait(500);
      cy.compareSnapshot("position-left", 0.05);
    });
  });

  it("should update the modal after refresh(true)", () => {
    cy.window().then((win) => {
      const instance = win.introJs().setOptions({
        showProgress: true,
        showBullets: true,
        steps: [
          {
            element: "#main-section",
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
        cy.compareSnapshot("refresh-first-step", 0.05);
        cy.nextStep();

        cy.wait(500).then(() => {
          cy.compareSnapshot("refresh-second-step", 0.05);

          cy.wait(500).then(() => {
            instance
              .setOptions({
                steps: [
                  {
                    element: "#main-section",
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
            cy.compareSnapshot("refresh-third-step", 0.05);
          });
        });
      });
    });
  });
});
