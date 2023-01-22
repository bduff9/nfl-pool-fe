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
import type { Faq, Log, LogAction, Rule, SystemValue } from '../generated/graphql';

type GetSupportContentResponse = {
	faqs: Array<
		Pick<
			Faq,
			| 'supportContentID'
			| 'supportContentCategory'
			| 'supportContentDescription'
			| 'supportContentDescription2'
			| 'supportContentKeywords'
		>
	>;
	rules: Array<
		Pick<
			Rule,
			'supportContentID' | 'supportContentDescription' | 'supportContentKeywords'
		>
	>;
	slackLink: Pick<SystemValue, 'systemValueValue'>;
	supportEmail: Pick<SystemValue, 'systemValueValue'>;
};

// const getSupportContentQuery = `
// 	query GetSupportContent($Name1: String!, $Name2: String!) {
// 		supportEmail: getSystemValue(Name: $Name1) {
// 			systemValueValue
// 		}
// 		slackLink: getSystemValue(Name: $Name2) {
// 			systemValueValue
// 		}
// 		faqs: getFAQs {
// 			supportContentID
// 			supportContentType
// 			supportContentCategory
// 			supportContentDescription
// 			supportContentDescription2
// 			supportContentKeywords
// 		}
// 		rules: getRules {
// 			supportContentID
// 			supportContentDescription
// 			supportContentKeywords
// 		}
// 	}
// `;

export const getSupportContent = async (): Promise<GetSupportContentResponse> => ({
	faqs: [],
	rules: [],
	slackLink: {},
	supportEmail: {},
});

type WriteLogResponse = { writeLog: Pick<Log, 'logID'> };

// const writeLogMutation = `
// 	mutation WriteToLog($data: WriteLogInput!) {
// 		writeLog(data: $data) {
// 			logID
// 		}
// 	}
// `;

export const writeSupportLog = async (
	_logAction: LogAction,
	_userID: null | string,
	_logMessage: string,
): Promise<WriteLogResponse> => ({
	writeLog: {} as Pick<Log, 'logID'>,
});
