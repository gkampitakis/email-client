import MailGun from './MailGun';

jest.mock('mailgun-js');
jest.mock('fs');

describe('MailGun', () => {
	const { MailGunSpy, MailGunSendSpy, MailGunConfig } = jest.requireMock('mailgun-js'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		MailGunSpy.mockClear();
		MailGunSendSpy.mockClear();
		FsMock.ReadFileSyncSpy.mockClear();

		MailGunConfig.error = null;
	});

	it('Should initialize mailgun', () => {
		new MailGun({ api_key: 'mockKey', domain: 'mockDomain' });

		expect(MailGunSpy).toHaveBeenNthCalledWith(1, { apiKey: 'mockKey', domain: 'mockDomain' });
	});

	it('Should call the send message', async () => {
		const transporter = new MailGun({ api_key: 'mockKey', domain: 'mockDomain' }),
			message = {
				from: 'george',
				to: ['george']
			};

		const res = await transporter.send(message);

		expect(res).toEqual({
			from: 'george',
			to: 'george'
		});
		expect(MailGunSendSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george'
		});
		expect(MailGunSpy).toHaveBeenNthCalledWith(1, { apiKey: 'mockKey', domain: 'mockDomain' });
	});

	it('Should include attachments if present', async () => {
		const transporter = new MailGun({ api_key: 'mockApiKey', domain: 'mockDomain' });

		await transporter.send({
			from: 'george',
			to: ['george'],
			bcc: ['george', 'john'],
			cc: ['george', 'john'],
			html: '<div>Test</div>',
			text: 'test',
			attachments: [{ name: 'mockAttachments', path: 'mock/path' }]
		});

		expect(MailGunSendSpy).toHaveBeenNthCalledWith(1, {
			from: 'george',
			to: 'george',
			html: '<div>Test</div>',
			text: 'test',
			bcc: 'george,john',
			cc: 'george,john',
			attachment: [{ filename: 'mockAttachments', data: 'mock/path' }]
		});
		expect(FsMock.ReadFileSyncSpy).toHaveBeenNthCalledWith(1, 'mock/path');
	});

	it('Should reject with error', async () => {
		MailGunConfig.error = new Error('MockError');

		const transporter = new MailGun({ api_key: 'mockKey', domain: 'mockDomain' }),
			message = {
				from: 'george',
				to: ['george'],
				html: '<div>Test</div>',
				text: 'test'
			};

		expect(transporter.send(message)).rejects.toThrow(Error('MockError'));
	});

	it('Should return mailgun', () => {
		const transporter = new MailGun({ api_key: 'mockKey', domain: 'mockDomain' });

		expect(transporter.get().messages).toBeInstanceOf(Function);
	});
});
