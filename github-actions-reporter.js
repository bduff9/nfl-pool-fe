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
class GithubActionsReporter {
	constructor (globalConfig, options) {
		this._globalConfig = globalConfig;
		this._options = options;
	}

	onRunComplete (contexts, results) {
		results.testResults.forEach(testResultItem => {
			const testFilePath = testResultItem.testFilePath;

			testResultItem.testResults.forEach(result => {
				if (result.status !== 'failed') {
					return;
				}

				result.failureMessages.forEach(failureMessages => {
					const newLine = '%0A';
					const message = failureMessages.replace(/\r?\n/g, newLine);
					const captureGroup = message.match(/:([0-9]+):([0-9]+)/);

					if (!captureGroup) {
						console.log('Unable to extract line number from call stack');

						return;
					}

					const [, line, col] = captureGroup;

					console.log(
						`::error file=${testFilePath},line=${line},col=${col}::${message}`,
					);
				});
			});
		});
	}
}

module.exports = GithubActionsReporter;
