import { Transporter } from '../Transporter';
import sendgrid from '@sendgrid/mail';

export default class SendGrid extends Transporter {
	constructor(configuration: any) {
		super(configuration);
		sendgrid.setApiKey(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		let { html, text, ...data } = message;
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

		return sendgrid.send(data);
	}

	public get(): any {
		return sendgrid;
	}
}
