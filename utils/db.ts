import mysql from 'mysql';

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
		connection.query(query, variables || [], (error, results) => {
			if (error) reject(error);

			resolve(results);
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
		connection.query(query, variables || [], (error, results) => {
			if (error) reject(error);

			resolve(results);
		});
	});

	return result;
};
