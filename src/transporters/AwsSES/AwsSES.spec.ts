import AwsSES from './AwsSES';

jest.mock('aws-sdk');

describe('AwsSES', () => {
	const { CredentialsSpy, SESSpy, SendEmailSpy, ConfigUpdateSpy, SES: SESMock } = jest.requireMock('aws-sdk');

	beforeEach(() => {
		CredentialsSpy.mockClear();
		SESSpy.mockClear();
		SendEmailSpy.mockClear();
		ConfigUpdateSpy.mockClear();
	});

	it('Should initialize AwsSES', () => {
		new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

		expect(CredentialsSpy).toHaveBeenNthCalledWith(1, { accessKeyId: 'mockKey', secretAccessKey: 'mockKey' });
		expect(ConfigUpdateSpy).toHaveBeenCalledTimes(1);
		expect(SESSpy).toHaveBeenCalledTimes(1);
	});

	it('Should call the send message', async () => {
		const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

		transporter.send({
			html: '<div>Test</div>',
			subject: 'testSubject',
			from: 'me@gmail.com',
			to: 'you@gmail.com',
			text: 'text'
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			Destination: {
				CcAddresses: [],
				ToAddresses: ['you@gmail.com'],
				BccAddresses: []
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: '<div>Test</div>'
					},
					Text: {
						Charset: 'UTF-8',
						Data: 'text'
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'testSubject'
				}
			},
			Source: 'me@gmail.com',
			ReplyToAddresses: []
		});
	});

	it('Should call the send message with default values', async () => {
		const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

		transporter.send({
			from: 'me@gmail.com',
			to: 'you@gmail.com',
			cc: ['test@address.com'],
			bcc: ['test@address.com'],
			replyTo: ['test@address.com']
		});

		expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
			Destination: {
				CcAddresses: ['test@address.com'],
				ToAddresses: ['you@gmail.com'],
				BccAddresses: ['test@address.com']
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: ''
					},
					Text: {
						Charset: 'UTF-8',
						Data: ''
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: ''
				}
			},
			Source: 'me@gmail.com',
			ReplyToAddresses: ['test@address.com']
		});
	});

	it('Should return AwsSES', () => {
		const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

		expect(transporter.get()).toBeInstanceOf(SESMock);
	});
});
