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
				cy.get('h1').should('be.visible').and('have.text', 'Support/FAQs');
				cy.get('a').should('be.visible').and('have.text', 'Back to login');

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});

			it('should have a Rules section', () => {
				//TODO:
				// if (Cypress.env('SKIP_PERCY') !== 'true') {
				// 	cy.percySnapshot();
				// }
			});

			it('should have an FAQ section', () => {
				//TODO:
				// if (Cypress.env('SKIP_PERCY') !== 'true') {
				// 	cy.percySnapshot();
				// }
			});

			it('should have a Contact Us section', () => {
				//TODO:
				// if (Cypress.env('SKIP_PERCY') !== 'true') {
				// 	cy.percySnapshot();
				// }
			});

			it('should allow searching on page', () => {
				//TODO:
				// if (Cypress.env('SKIP_PERCY') !== 'true') {
				// 	cy.percySnapshot();
				// }
			});
		});
	});
});
