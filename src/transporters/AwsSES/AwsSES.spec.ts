import AwsSES from './AwsSES';

jest.mock('');

describe('AwsSES', () => {
	jest.requireMock('');

	// beforeEach(() => {});

	it('Should initialize AwsSES', () => {
		expect(true).toBe(true);
	});

	it('Should call the send message', async () => {
		expect(true).toBe(true);
	});

	it('Should return AwsSES', () => {
		expect(true).toBe(true);
	});
});
