import { getPageTitle } from '../../utils';

describe('getPageTitle', () => {
	it('returns title', () => {
		const title = getPageTitle('Testing');

		expect(title).toEqual('Testing | NFL Confidence Pool');
	});
});
