import { Transporter } from '../Transporter';
import sendgrid from '@sendgrid/mail';

export default class SendGrid extends Transporter {
	constructor(configuration: any) {
		super(configuration);
		sendgrid.setApiKey(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		return sendgrid.send(this.messageTransform(message) as any);
	}

	public get(): any {
		return sendgrid;
	}

	protected messageTransform(message: any): {} {
		const { html, text, ...data } = message;
		data.content = [
			{
				type: 'text/plain',
				value: text
			},
			{
				type: 'text/html',
				value: html
			}
		];

		return data;
	}
}
