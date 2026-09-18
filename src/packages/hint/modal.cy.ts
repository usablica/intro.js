context("Hints Modal", () => {
  it("should be able to open and close hint modals", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs.hint();

      instance.showHints();

      cy.get(".introjs-hint").first().click();

      cy.get(".introjs-tooltip").should("have.length", 1);
      cy.get(".introjs-tooltip").contains("fixed header");

      cy.get(".introjs-button").click();

      cy.get(".introjs-tooltip").should("have.length", 0);
    });
  });

  it("should display the correct modal content", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs.hint();

      instance.showHints();

      cy.get(".introjs-hint").first().click();

      cy.get(".introjs-tooltip").contains("fixed header");

      cy.get(".introjs-hint").eq(1).click();

      cy.get(".introjs-tooltip").contains("a button");

      cy.get(".introjs-hint").eq(2).click();

      cy.get(".introjs-tooltip").contains("secondary header");

      cy.get(".introjs-hint").eq(3).click();

      cy.get(".introjs-tooltip").contains("this is the footer");
    });
  });

  it("clicking on the same hint should close the modal", () => {
    cy.visit("./cypress/setup/index.html").then((window) => {
      const instance = window.introJs.hint();

      instance.showHints();

      for (let i = 0; i < 3; i++) {
        cy.get(".introjs-hint").first().click();

        cy.get(".introjs-tooltip").contains("fixed header");

        cy.get(".introjs-hint").first().click();

        cy.get(".introjs-tooltip").should("not.exist");
      }
    });
  });

  // https://github.com/usablica/intro.js/issues/2127
  describe("onHintDialogClose", () => {
    it("should be called when clicking outside the dialog", () => {
      cy.visit("./cypress/setup/index.html").then((window) => {
        const onHintDialogClose = cy.stub().as("onHintDialogClose");
        const instance = window.introJs.hint();
        instance.onHintDialogClose(onHintDialogClose);
        instance.showHints();

        cy.get(".introjs-hint").first().click();
        cy.get(".introjs-tooltip").should("have.length", 1);

        cy.get("body").click(0, 0);

        cy.get(".introjs-tooltip").should("not.exist");
        cy.get("@onHintDialogClose").should("have.been.calledOnce");
      });
    });

    it("should be called when toggling the same hint closed", () => {
      cy.visit("./cypress/setup/index.html").then((window) => {
        const onHintDialogClose = cy.stub().as("onHintDialogClose");
        const instance = window.introJs.hint();
        instance.onHintDialogClose(onHintDialogClose);
        instance.showHints();

        cy.get(".introjs-hint").first().click();
        cy.get(".introjs-hint")
          .first()
          .click()
          .then(() => {
            expect(onHintDialogClose).to.have.been.calledOnce;
          });
      });
    });

    it("should not be called when there is no open dialog to close", () => {
      cy.visit("./cypress/setup/index.html").then((window) => {
        const onHintDialogClose = cy.stub().as("onHintDialogClose");
        const instance = window.introJs.hint();
        instance.onHintDialogClose(onHintDialogClose);
        instance.showHints();

        cy.get("body")
          .click(0, 0)
          .then(() => {
            expect(onHintDialogClose).not.to.have.been.called;
          });
      });
    });
  });
});
