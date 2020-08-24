export class ServerClient {
	public static ClientSpy = jest.fn();
	public static SendSpy = jest.fn();

	public constructor(...args) {
		ServerClient.ClientSpy(...args);
	}

	public sendEmail(message: any) {
		ServerClient.SendSpy(message);
		return message;
	}
}
