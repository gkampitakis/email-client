class SendGrid {
	public static SendSpy = jest.fn();
	public static ConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		SendGrid.ConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		SendGrid.SendSpy(message);

		return Promise.resolve(message);
	}
}

class MailGun {
	public static SendSpy = jest.fn();
	public static ConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		MailGun.ConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		MailGun.SendSpy(message);

		return Promise.resolve(message);
	}
}

export const Transporters = {
	sendgrid: SendGrid,
	mailgun: MailGun
};
