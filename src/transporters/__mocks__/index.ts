class SendGrid {
	public static SendGridSendSpy = jest.fn();
	public static SendGridConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		SendGrid.SendGridConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		SendGrid.SendGridSendSpy(message);

		return Promise.resolve(message);
	}
}

class MailGun {
	public static MailGunSendSpy = jest.fn();
	public static MailGunConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		MailGun.MailGunConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		MailGun.MailGunSendSpy(message);

		return Promise.resolve(message);
	}
}

export const Transporters = {
	sendgrid: SendGrid,
	mailgun: MailGun
};
