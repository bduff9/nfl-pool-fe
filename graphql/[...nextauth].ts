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
import type { Log, LogAction } from '../generated/graphql';

type WriteLogResponse = {
	writeLog: Pick<Log, 'logID'>;
};

// const writeLogQuery = `
// 	mutation WriteToLog($data: WriteLogInput!) {
// 		writeLog(data: $data) {
// 			logID
// 		}
// 	}
// `;

export const writeLog = async (
	_logAction: LogAction,
	_logMessage: string,
	_sub: null | string = null,
): Promise<WriteLogResponse> => ({
	writeLog: {} as Pick<Log, 'logID'>,
});
