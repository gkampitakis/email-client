import Postmark from './Postmark';

jest.mock('postmark');
jest.mock('fs');
jest.mock('mime-types');

describe('Postmark', () => {
	const PostmarkMock = jest.requireMock('postmark').ServerClient,
		{ LookupSpy, SRC } = jest.requireMock('mime-types'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		PostmarkMock.ClientSpy.mockClear();
		PostmarkMock.SendSpy.mockClear();
		LookupSpy.mockClear();
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
		expect(LookupSpy).toHaveBeenNthCalledWith(1, 'mock/path');
	});

	it('Should not return type if no result is returned in attachments', async () => {
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
				{ ContentType: '', Name: 'mockAttachments', Content: 'mock/path' },
				{ ContentType: '', Name: 'mockAttachments', Content: 'mock/path2' }
			]
		});

		expect(LookupSpy).toHaveBeenCalledTimes(2);
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
	});

	it('Should handle mixed attachments structure', async () => {
		const transporter = new Postmark({ serverToken: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: ['george', 'john'],
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			attachments: [{ name: 'mockAttachments', path: 'mock/path' }, 'mock2/path2', '/mock3/path3.txt']
		});

		expect(PostmarkMock.SendSpy).toHaveBeenNthCalledWith(1, {
			From: 'george',
			To: 'george,john',
			HtmlBody: '<div>Test</div>',
			TextBody: 'test',
			Subject: 'test',
			attachments: [
				{ ContentType: 'image/png', Name: 'mockAttachments', Content: 'mock/path' },
				{ ContentType: 'image/png', Name: 'path2', Content: 'mock2/path2' },
				{ ContentType: 'image/png', Name: 'path3.txt', Content: '/mock3/path3.txt' }
			]
		});
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
