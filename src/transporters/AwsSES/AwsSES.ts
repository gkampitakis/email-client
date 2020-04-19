import { Transporter } from '../Transporter';
import { Credentials, SES, config } from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

export default class AwsSES extends Transporter {
	private client: SES | undefined;
	constructor(configuration: any) {
		super(configuration);
		this.setupAwsSES(configuration);
	}

	public send(message: any): Promise<any> {
		return this.client!.sendEmail(this.messageTransform(message) as SendEmailRequest).promise();
	}

	public get(): any {
		return this.client;
	}

	private setupAwsSES(configuration: any) {
		const { accessKeyId, secretAccessKey, region } = configuration,
			//@ts-ignore
			credentials = new Credentials({ accessKeyId, secretAccessKey });
		config.update({ credentials, region });
		this.client = new SES();
	}

	protected messageTransform(message: any): {} {
		const { from, to, subject = '', html = '', text = '', CcAddresses = [], replyTo = [] } = message;

		return {
			Destination: {
				CcAddresses,
				ToAddresses: [to],
				BccAddresses: []
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: html
					},
					Text: {
						Charset: 'UTF-8',
						Data: text
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: subject
				}
			},
			Source: from,
			ReplyToAddresses: replyTo
		};
	}
}
