class SendGrid {
	public static SendSpy = jest.fn();
	public static GetSpy = jest.fn();
	public static ConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		SendGrid.ConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		SendGrid.SendSpy(message);

		return Promise.resolve(message);
	}

	public get(): any {
		SendGrid.GetSpy();
		return null;
	}
}

class PostMark {
	public static SendSpy = jest.fn();
	public static GetSpy = jest.fn();
	public static ConstructorSpy = jest.fn();

	public constructor(configuration: any) {
		PostMark.ConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		PostMark.SendSpy(message);

		return Promise.resolve(message);
	}

	public get(): any {
		PostMark.GetSpy();
		return null;
	}
}

class MailGun {
	public static SendSpy = jest.fn();
	public static ConstructorSpy = jest.fn();
	public static GetSpy = jest.fn();

	public constructor(configuration: any) {
		MailGun.ConstructorSpy(configuration);
	}

	public send(message: any): Promise<any> {
		MailGun.SendSpy(message);

		return Promise.resolve(message);
	}

	public get(): any {
		MailGun.GetSpy();
		return null;
	}
}

export const Transporters = {
	sendgrid: SendGrid,
	mailgun: MailGun,
	postmark: PostMark
};
