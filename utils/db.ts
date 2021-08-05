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
import mysql from 'mysql2';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) throw new Error('Missing database URL');

export const getConnection = (): mysql.Connection => {
	const connection = mysql.createConnection(DATABASE_URL);

	connection.connect();

	return connection;
};

export const getAll = async <Result extends Record<string, unknown>, Vars>(
	connection: mysql.Connection,
	query: string,
	variables: Vars,
): Promise<Array<Result>> => {
	const result = await new Promise<Array<Result>>((resolve, reject) => {
		connection.query(query, variables ?? [], (error, results) => {
			if (error) reject(error);

			resolve(results as Array<Result>);
		});
	});

	return result;
};

export const getOne = async <Result, Vars>(
	connection: mysql.Connection,
	query: string,
	variables: Vars,
): Promise<Result> => {
	const [result] = await new Promise<Array<Result>>((resolve, reject) => {
		connection.query(query, variables ?? [], (error, results) => {
			if (error) reject(error);

			resolve(results as Array<Result>);
		});
	});

	return result;
};
