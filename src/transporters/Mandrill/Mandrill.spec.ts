import Mandrill from './Mandrill';

jest.mock('mandrill-api/mandrill');

describe('Mandrill', () => {
	const MandrillMock = jest.requireMock('mandrill-api/mandrill').Mandrill;

	beforeEach(() => {
		MandrillMock.ConstructorSpy.mockClear();
		MandrillMock.SendSpy.mockClear();

		MandrillMock.ResponseOptions = false;
	});

	it('Should call the send message', () => {
		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test'
		});

		expect(MandrillMock.SendSpy).toHaveBeenNthCalledWith(1, {
			message: {
				text: 'test',
				html: '<div>Test</div>',
				subject: 'test',
				to: 'george',
				from_email: 'george',
				from_name: undefined,
				headers: {
					'Reply-To': undefined
				}
			},
			async: true
		});
		expect(MandrillMock.ConstructorSpy).toHaveBeenNthCalledWith(1, 'mockApiKey');
	});

	it('Should reject with error', async () => {
		MandrillMock.ResponseOptions = true;

		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		try {
			await transporter.send({
				from: 'george',
				to: 'george',
				html: '<div>Test</div>',
				text: 'test',
				subject: 'test'
			});
		} catch (err) {
			expect(err.message).toBe('mockError');
		}
	});

	it('Should return mandrill', () => {
		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		expect(transporter.get()).toBeInstanceOf(MandrillMock);
	});
});
