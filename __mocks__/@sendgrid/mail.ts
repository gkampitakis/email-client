export const SendEmailSpy = jest.fn(),
	SetApiKeySpy = jest.fn();

function setApiKey(key: string): void {
	SetApiKeySpy(key);
	return;
}

function send(message: any): Promise<any> {
	SendEmailSpy(message);
	return Promise.resolve();
}

export default {
	send,
	setApiKey
};
