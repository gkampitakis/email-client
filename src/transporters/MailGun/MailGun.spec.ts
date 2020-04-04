import MailGun from './MailGun';

describe('MailGun', () => {
	it('Send', () => {
		const mailGun = new MailGun({});
		expect(mailGun).resolves;
	});
});
