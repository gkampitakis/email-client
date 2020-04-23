const CredentialsSpy = jest.fn(),
	SESSpy = jest.fn(),
	SendRawEmailSpy = jest.fn(),
	ConfigUpdateSpy = jest.fn();

class Credentials {
	public constructor(options) {
		CredentialsSpy(options);
	}
}

class SES {
	public constructor() {
		SESSpy();
	}

	public sendRawEmail(message) {
		SendRawEmailSpy(message);
		return {
			promise: () => Promise.resolve(message)
		};
	}
}

const config = {
	update(options) {
		ConfigUpdateSpy(options);
	}
};

export { SES, Credentials, config, CredentialsSpy, SESSpy, SendRawEmailSpy, ConfigUpdateSpy };
