import Postmark from './Postmark';

jest.mock('postmark');
jest.mock('fs');
jest.mock('file-type');

describe('Postmark', () => {
	const PostmarkMock = jest.requireMock('postmark').ServerClient,
		{ FromFileSpy, SRC } = jest.requireMock('file-type'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		PostmarkMock.ClientSpy.mockClear();
		PostmarkMock.SendSpy.mockClear();
		FromFileSpy.mockClear();
		FsMock.ReadFileSyncSpy.mockClear();

		SRC.result = true;
	});

	it('Should call the send message', async () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		await transporter.send({
			from: 'george',
			to: ['george'],
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test'
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george',
			HtmlBody: '<div>Test</div>',
			TextBody: 'test',
			Subject: 'test'
		});
		expect(PostmarkMock.ClientSpy).toHaveBeenNthCalledWith(1, 'mockApiKey', { mock: 'data' });
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(0);
	});

	it('Should include attachments if present', async () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		await transporter.send({
			from: 'george',
			to: ['george', 'john'],
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			attachments: [{ name: 'mockAttachments', path: 'mock/path' }]
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george,john',
			HtmlBody: '<div>Test</div>',
			TextBody: 'test',
			Subject: 'test',
			attachments: [{ ContentType: 'image/png', Name: 'mockAttachments', Content: 'mock/path' }]
		});
		expect(FsMock.ReadFileSyncSpy).toHaveBeenNthCalledWith(1, 'mock/path');
		expect(FromFileSpy).toHaveBeenNthCalledWith(1, 'mock/path');
	});

	it('Should return undefined type if no result is returned in attachments', async () => {
		SRC.result = false;

		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		await transporter.send({
			from: 'george',
			to: ['george', 'john'],
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			attachments: [
				{ name: 'mockAttachments', path: 'mock/path' },
				{ name: 'mockAttachments', path: 'mock/path2' }
			]
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george,john',
			HtmlBody: '<div>Test</div>',
			TextBody: 'test',
			Subject: 'test',
			attachments: [
				{ ContentType: undefined, Name: 'mockAttachments', Content: 'mock/path' },
				{ ContentType: undefined, Name: 'mockAttachments', Content: 'mock/path2' }
			]
		});

		expect(FromFileSpy).toHaveBeenCalledTimes(2);
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
	});

	it('Should include bcc/cc if present in correct format', async () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		await transporter.send({
			from: 'george',
			to: ['george', 'john'],
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			bcc: ['george', 'john'],
			cc: ['george', 'john']
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george,john',
			HtmlBody: '<div>Test</div>',
			TextBody: 'test',
			Subject: 'test',
			Bcc: 'george,john',
			Cc: 'george,john'
		});
	});

	it('Should not include not existent fields on the message', async () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		await transporter.send({
			from: 'george',
			to: ['george', 'john']
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george,john'
		});
	});

	it('Should return postmark', () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey', configOptions: { mock: 'data' } as any });

		expect(transporter.get()).toBeInstanceOf(PostmarkMock);
	});
});
