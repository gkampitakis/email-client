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
		const { html, text, _attachments, ...data } = message;

		data.content = [];

		if (text)
			data.content.push({
				type: 'text/plain',
				value: text
			});

		if (html)
			data.content.push({
				type: 'text/html',
				value: html
			});

		if (_attachments) data.attachments = _attachments;

		return data;
	}
}
