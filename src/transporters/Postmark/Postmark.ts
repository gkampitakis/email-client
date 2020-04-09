import { Transporter } from '../Transporter';
import { ServerClient } from 'postmark';

export default class Postmark extends Transporter {
	private client;
	constructor(configuration: any) {
		super(configuration);
		this.client = new ServerClient(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		return this.client.sendEmail({
			From: message.from,
			To: message.to,
			Subject: message.subject,
			TextBody: message.text,
			HtmlBody: message.html
		});
	}

	public get(): any {
		return this.client;
	}
}
