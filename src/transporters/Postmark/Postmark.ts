import { Transporter } from '../Transporter';
import { ServerClient } from 'postmark';

export default class Postmark extends Transporter {
	private client;
	constructor(configuration: any) {
		super(configuration);
		this.client = new ServerClient(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		return this.client.sendEmail(this.messageTransform(message));
	}

	public get(): any {
		return this.client;
	}

	protected messageTransform(message: any): {} {
		const { from, to, subject, text, html, ...rest } = message;

		return {
			From: from,
			To: to,
			Subject: subject,
			TextBody: text,
			HtmlBody: html,
			...rest
		};
	}
}
