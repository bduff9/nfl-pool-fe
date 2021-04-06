/// <reference types="cypress" />
// ts-prune-ignore-next
export {};

describe('Login', () => {
	context('Desktop', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});

		describe('When you visit home', () => {
			it('should redirect to login', () => {
				cy.visit('/');
				cy.get('.btn.btn-primary').should('be.visible');
				cy.url().should('include', '/auth/login');
				cy.percySnapshot();
			});
		});

		describe('Login flow', () => {
			it('should reject invalid emails', () => {
				cy.get('#email').type('invalid{enter}');
				//TODO: validate error message
			});

			it('should reject invalid domains', () => {
				cy.get('#email').type('invalid@gmail.co{enter}');
				//TODO: validate error message
			});

			//TODO: use mailslurp to test sign in

			//TODO: validate preview link works

			//TODO: validate link signs user in

			//TODO: validate navigating to login redirects to home

			//TODO: validate sign out signs user out
		});
	});

	context('iPhone 5', () => {
		beforeEach(() => {
			cy.viewport('iphone-5');
		});

		describe('When you visit home', () => {
			it('should redirect to login', () => {
				cy.visit('/');
				cy.get('.btn.btn-primary').should('be.visible');
				cy.url().should('include', '/auth/login');
				cy.percySnapshot();
			});
		});

		describe('Login flow', () => {
			it('should reject invalid emails', () => {
				cy.get('#email').type('invalid{enter}');
				//TODO: validate error message
			});

			it('should reject invalid domains', () => {
				cy.get('#email').type('invalid@gmail.co{enter}');
				//TODO: validate error message
			});

			//TODO: fake sign in user

			//TODO: validate navigating to login redirects to home

			//TODO: validate sign out signs user out
		});
	});
});
