import MailGun from './MailGun';

jest.mock('mailgun-js');

describe('MailGun', () => {
	const { MailGunSpy, MailGunSendSpy, MailGunConfig } = jest.requireMock('mailgun-js');

	beforeEach(() => {
		MailGunSpy.mockClear();
		MailGunSendSpy.mockClear();
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
				to: 'george',
				html: '<div>Test</div>',
				text: 'test'
			};

		const res = await transporter.send(message);

		expect(res).toBe(message);
		expect(MailGunSendSpy).toHaveBeenNthCalledWith(1, message);
		expect(MailGunSpy).toHaveBeenNthCalledWith(1, { apiKey: 'mockKey', domain: 'mockDomain' });
	});

	it('Should reject with error', async () => {
		MailGunConfig.error = new Error('MockError');

		const transporter = new MailGun({ api_key: 'mockKey', domain: 'mockDomain' }),
			message = {
				from: 'george',
				to: 'george',
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
