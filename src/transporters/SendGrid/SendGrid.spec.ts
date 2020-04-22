import SendGrid from './SendGrid';

jest.mock('@sendgrid/mail');
jest.mock('fs');
jest.mock('file-type');

describe('SendGrid', () => {
	const { SendEmailSpy, SetApiKeySpy } = jest.requireMock('@sendgrid/mail'),
		{ FromFileSpy, SRC } = jest.requireMock('file-type'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		SendEmailSpy.mockClear();
		SetApiKeySpy.mockClear();
		FromFileSpy.mockClear();
		FsMock.ReadFileSyncSpy.mockClear();

		SRC.result = true;
	});

	it('Should call the send message', async () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		await transporter.send({
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
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(0);
	});

	it('Should include attachments if present', async () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			attachments: [{ name: 'mockAttachments', path: 'mock/path' }]
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
			attachments: [{ type: 'image/png', filename: 'mockAttachments', content: 'mock/path' }]
		});
		expect(FsMock.ReadFileSyncSpy).toHaveBeenNthCalledWith(1, 'mock/path');
		expect(FromFileSpy).toHaveBeenNthCalledWith(1, 'mock/path');
	});

	it('Should return undefined type if no result is returned in attachments', async () => {
		SRC.result = false;

		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			attachments: [
				{ name: 'mockAttachments', path: 'mock/path' },
				{ name: 'mockAttachments', path: 'mock/path2' }
			]
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
			attachments: [
				{ type: undefined, filename: 'mockAttachments', content: 'mock/path' },
				{ type: undefined, filename: 'mockAttachments', content: 'mock/path2' }
			]
		});

		expect(FromFileSpy).toHaveBeenCalledTimes(2);
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
	});

	it('Should not include html in message body', async () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			text: 'test'
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george',
			content: [
				{
					type: 'text/plain',
					value: 'test'
				}
			]
		});
	});

	it('Should not include text in message body', async () => {
		const transporter = new SendGrid({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>'
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george',
			content: [
				{
					type: 'text/html',
					value: '<div>Test</div>'
				}
			]
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
