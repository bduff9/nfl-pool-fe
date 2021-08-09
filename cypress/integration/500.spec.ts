/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
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
				cy.get('h2').should('be.visible').and('contain.text', 'There has been an error.');
				cy.get('a').should('have.length', 2);

				if (Cypress.env('SKIP_PERCY') !== 'true') {
					cy.percySnapshot();
				}
			});
		});
	});
});
