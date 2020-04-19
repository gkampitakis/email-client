import SendGrid from './SendGrid';

jest.mock('@sendgrid/mail');

describe('SendGrid', () => {
	const { SendEmailSpy, SetApiKeySpy } = jest.requireMock('@sendgrid/mail');

	beforeEach(() => {
		SendEmailSpy.mockClear();
		SetApiKeySpy.mockClear();
	});

	it('Should call the send message', () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test'
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george',
			content: [
				{
					type: 'text/plain',
					value: 'test'
				},
				{
					type: 'text/html',
					value: '<div>Test</div>'
				}
			]
		});
		expect(SetApiKeySpy).toHaveBeenNthCalledWith(1, 'mockApiKey');
	});

	it('Should include attachments if present', () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			_attachments: ['mockAttachments']
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george',
			content: [
				{
					type: 'text/plain',
					value: 'test'
				},
				{
					type: 'text/html',
					value: '<div>Test</div>'
				}
			],
			attachments: ['mockAttachments']
		});
	});

	it('Should return sendgrid', () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		expect(transporter.get()).toEqual({
			send: expect.any(Function),
			setApiKey: expect.any(Function)
		});
	});
});
