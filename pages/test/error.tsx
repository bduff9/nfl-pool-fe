import { GetServerSideProps } from 'next';
import React, { FC } from 'react';

const TestError: FC = () => <h1>Test Page</h1>;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async () => {
	throw new Error('Testing 500 page');
};

// ts-prune-ignore-next
export default TestError;
