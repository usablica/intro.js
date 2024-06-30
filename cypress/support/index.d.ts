
declare namespace Cypress {
  interface Chainable<Subject = any>{
    nextStep(): Chainable<any>;
    prevStep(): Chainable<any>;
  }
  interface Window {
    introJs: any;
  }
}
