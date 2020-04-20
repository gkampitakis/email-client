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
			subject: 'test',
			bcc: ['mock@mail.com'],
			cc: ['mock@mail.com']
		});

		expect(MandrillMock.SendSpy).toHaveBeenNthCalledWith(1, {
			message: {
				text: 'test',
				html: '<div>Test</div>',
				subject: 'test',
				to: [
					{ email: 'george', type: 'to' },
					{ email: 'mock@mail.com', type: 'cc' },
					{ email: 'mock@mail.com', type: 'bcc' }
				],
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

	it('Should include attachments if present', () => {
		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			_attachments: ['mockAttachments']
		});

		expect(MandrillMock.SendSpy).toHaveBeenNthCalledWith(1, {
			message: {
				text: 'test',
				html: '<div>Test</div>',
				subject: 'test',
				to: [{ email: 'george', type: 'to' }],
				from_email: 'george',
				from_name: undefined,
				headers: {
					'Reply-To': undefined
				},
				attachments: ['mockAttachments']
			},
			async: true
		});
	});

	//it('Should include the cc/bcc email addresses to message',()=)

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
