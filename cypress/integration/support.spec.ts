/// <reference types="cypress" />
// ts-prune-ignore-next
export {};

describe('FAQ/Support', () => {
	context('Desktop', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});

		describe('When you visit support', () => {
			it('should display support', () => {
				cy.visit('/support');
				cy.get('label').should('be.visible').and('have.text', 'Search the help page');
			});

			it('should have a Rules section', () => {
				cy.get('#rules').scrollIntoView().should('have.text', 'Rules');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});

			it('should have an FAQ section', () => {
				cy.get('#faq').scrollIntoView().should('have.text', 'FAQ');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});

			it('should have a Contact Us section', () => {
				cy.get('#contact').scrollIntoView().should('have.text', 'Contact Us');
				cy.get('.btn-primary').should('be.visible').and('have.text', 'Back to login');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});

			it('should allow searching on page', () => {
				cy.get('#top').scrollIntoView();
				cy.get('#search').type('pick');
				cy.wait(1000);
				cy.get('mark').should('exist');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});
		});
	});
});
