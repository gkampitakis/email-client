export class Mandrill {
	public static ConstructorSpy = jest.fn();
	public static SendSpy = jest.fn();
	public static ResponseOptions = false;
	public messages;

	public constructor(key: string) {
		Mandrill.ConstructorSpy(key);

		this.messages = {
			send: this.send
		};
	}

	public send({ message, async }, success, failure) {
		Mandrill.SendSpy({ message, async });

		if (Mandrill.ResponseOptions) return failure(new Error('mockError'));

		success(message);
	}
}

export default {
	Mandrill
};
