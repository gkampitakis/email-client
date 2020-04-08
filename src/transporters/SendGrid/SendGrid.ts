import { Transporter } from '../Transporter';
import { send, setApiKey } from '@sendgrid/mail';

export default class SendGrid extends Transporter {
	constructor(configuration: any) {
		super(configuration);
		setApiKey(configuration.api_key);
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

		return send(data);
	}
}
