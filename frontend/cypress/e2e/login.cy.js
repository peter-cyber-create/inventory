// Sample Cypress E2E test for login

describe('Login Flow', () => {
  it('should log in successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    // Adjust the selector below to match your dashboard or success indication
    cy.contains('Dashboard').should('exist');
  });
});



