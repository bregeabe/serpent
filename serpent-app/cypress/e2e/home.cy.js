describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });

    it('should display the logo', () => {
      cy.get('img[alt="landscape-logo"]').should('exist');
    });

    it('should display the primary CTA buttons', () => {
      cy.contains('Use Serpent').should('have.attr', 'href', '/dashboard');
      cy.contains('About Serpent').should('have.attr', 'href', '/about');
    });

    it('should display the footer buttons', () => {
      cy.contains("Serpent's repo").should('have.attr', 'href', 'https://github.com/abrege11/serpent/');
      cy.contains('My portfolio').should('have.attr', 'href', 'https://abrege11.github.io');
      cy.contains('Contact me').should('have.attr', 'href', '/contact');
    });

    it('should navigate to /dashboard on button click', () => {
      cy.contains('Use Serpent').click();
      cy.url().should('include', '/dashboard');
    });
  });
