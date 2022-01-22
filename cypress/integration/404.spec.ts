/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
