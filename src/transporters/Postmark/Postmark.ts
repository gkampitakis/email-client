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
		const { from, to, subject, text, html, _attachments = [], bcc = [], cc = [], ...rest } = message;

		const attachments = _attachments.map((element) => {
				return {
					Name: element.filename,
					Content: element.content,
					ContentType: element.type
				};
			}),
			To = to.join(','),
			Cc = cc.join(','),
			Bcc = bcc.join(',');

		return {
			From: from,
			To,
			...(Bcc && { Bcc }),
			...(Cc && { Cc }),
			Subject: subject,
			TextBody: text,
			HtmlBody: html,
			...(attachments.length && { attachments }),
			...rest
		};
	}
}
