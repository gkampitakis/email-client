import Mandrill from './Mandrill';

jest.mock('mandrill-api/mandrill');
jest.mock('fs');
jest.mock('file-type');

describe('Mandrill', () => {
	const MandrillMock = jest.requireMock('mandrill-api/mandrill').Mandrill,
		{ FromFileSpy, SRC } = jest.requireMock('file-type'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		MandrillMock.ConstructorSpy.mockClear();
		MandrillMock.SendSpy.mockClear();
		FromFileSpy.mockClear();
		FsMock.ReadFileSyncSpy.mockClear();

		MandrillMock.ResponseOptions = false;
		SRC.result = true;
	});

	it('Should call the send message', async () => {
		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			bcc: ['mock@mail.com'],
			cc: ['mock@mail.com'],
			name: 'George',
			replyTo: 'test'
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
				from_name: 'George',
				headers: {
					'Reply-To': 'test'
				}
			},
			async: true
		});
		expect(MandrillMock.ConstructorSpy).toHaveBeenNthCalledWith(1, 'mockApiKey');
	});

	it('Should include attachments if present', async () => {
		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			subject: 'test',
			attachments: [{ name: 'mockAttachments', path: 'mock/path' }]
		});

		expect(MandrillMock.SendSpy).toHaveBeenNthCalledWith(1, {
			message: {
				text: 'test',
				html: '<div>Test</div>',
				subject: 'test',
				to: [{ email: 'george', type: 'to' }],
				from_email: 'george',
				attachments: [{ type: 'image/png', filename: 'mockAttachments', content: 'mock/path' }]
			},
			async: true
		});
		expect(FsMock.ReadFileSyncSpy).toHaveBeenNthCalledWith(1, 'mock/path');
		expect(FromFileSpy).toHaveBeenNthCalledWith(1, 'mock/path');
	});

	it('Should return undefined type if no result is returned in attachments', async () => {
		SRC.result = false;

		const transporter = new Mandrill({ api_key: 'mockApiKey' });

		await transporter.send({
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			attachments: [
				{ name: 'mockAttachments', path: 'mock/path' },
				{ name: 'mockAttachments', path: 'mock/path2' }
			]
		});

		expect(MandrillMock.SendSpy).toHaveBeenNthCalledWith(1, {
			message: {
				from_email: 'george',
				to: [{ email: 'george', type: 'to' }],
				html: '<div>Test</div>',
				attachments: [
					{ type: undefined, filename: 'mockAttachments', content: 'mock/path' },
					{ type: undefined, filename: 'mockAttachments', content: 'mock/path2' }
				]
			},
			async: true
		});

		expect(FromFileSpy).toHaveBeenCalledTimes(2);
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
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
