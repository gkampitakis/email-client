export class ServerClient {
	public static ClientSpy = jest.fn();
	public static SendSpy = jest.fn();

	public constructor(key: string) {
		ServerClient.ClientSpy(key);
	}

	public sendEmail(message: any) {
		ServerClient.SendSpy(message);
		return message;
	}
}
