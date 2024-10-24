const email = `khang+${crypto.randomUUID()}@gmail.com`;
const password = 'Khang@123456';

describe('Authentication flow', () => {
  it('should redirect to login when not logged in', () => {
    cy.visit('/dashboard');
    cy.contains('Welcome');
  });

  it('should signup a new user', () => {
    cy.visit('/register');
    cy.contains('Create your Account');
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('input[id="firstName"]').type('Khang');
    cy.get('input[id="lastName"]').type('Tran');
    cy.get('input[id="username"]').type(`khang${crypto.randomUUID()}`);
    cy.get('app-button').click();

    cy.wait(10000);

    cy.contains('Give your store a name and short description.');

    cy.visit('/dashboard');

    cy.contains('Give your store a name and short description.');
  });
})
