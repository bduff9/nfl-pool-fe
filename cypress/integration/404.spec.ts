/// <reference types="cypress" />
// ts-prune-ignore-next
export {};

describe('404 page', () => {
	context('Desktop', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});

		describe('When you visit an invalid route', () => {
			it('should show 404', () => {
				cy.visit('/invalid/route', { failOnStatusCode: false });
				cy.get('h1').should('be.visible').and('have.text', 'What have you done?!');
				cy.get('img')
					.should('be.visible')
					.and('have.attr', 'alt')
					.and('equal', 'Okay, this part was us.');
				cy.get('h4')
					.should('be.visible')
					.and(
						'have.text',
						'Something has gone wrong. It might be because of you. It might be because of us. Either way, this is awkward.',
					);
				cy.get('.text-center > a')
					.should('be.visible')
					.and('have.attr', 'href')
					.and('equal', '/');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});
		});
	});
});
