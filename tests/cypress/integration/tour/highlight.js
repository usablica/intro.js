context('Highlight', () => {
  beforeEach(() => {
    cy.visit('./cypress/setup/index.html');
  });

  it('should let user interact with the target element', () => {
    cy.window()
      .then(window => {
        window.introJs().setOptions({
          steps: [{
            intro: "step one"
          }, {
            element: "#clickable-button",
            intro: "step two"
          }]
        }).start();

        let sp = cy.spy(window, "click");

        cy.get('.introjs-nextbutton').click();
        cy.get('.introjs-tooltiptext').contains('step two');

        cy.get(".introjs-helperLayer").realHover();
        cy.get("#clickable-button").contains('Hovered');

        cy.get(".introjs-helperLayer").realClick().then(() => expect(sp).to.be.calledOnce);
      });
  });

  it('should interaction with the target element should be disabled when disabledInteraction is true', () => {
    cy.window()
      .then(window => {
        window.introJs().setOptions({
          disableInteraction: true,
          steps: [{
            element: "#clickable-button",
            intro: "step two"
          }]
        }).start();

        let sp = cy.spy(window, "click");

        cy.get(".introjs-helperLayer").realHover();
        cy.get("#clickable-button").contains('Example button');

        cy.get(".introjs-helperLayer").realClick().then(() => expect(sp).to.not.be.called);
      });
  });
});
