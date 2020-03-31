const SendEmailSpy = jest.fn();

function setApiKey(key: string): void {
    return;
}

function send(message: any): Promise<any> {
    SendEmailSpy(message);
    return Promise.resolve();
}

export {
    SendEmailSpy,
    send,
    setApiKey
};