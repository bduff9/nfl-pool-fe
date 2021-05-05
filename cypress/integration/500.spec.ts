/// <reference types="cypress" />
// ts-prune-ignore-next
export {};

describe('500 page', () => {
	context('Desktop', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});

		describe('When an uncaught error is thrown', () => {
			it('should show 500', () => {
				cy.visit('/test/error', { failOnStatusCode: false });
				cy.get('h1').should('be.visible').and('have.text', 'Flag on the play!');
				cy.get('img')
					.should('be.visible')
					.and('have.attr', 'alt')
					.and('equal', 'Flag on the play');
				cy.get('h2').should('be.visible').and('have.text', 'There has been an error.');
				cy.get('a').should('have.length', 2);

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});
		});
	});
});
