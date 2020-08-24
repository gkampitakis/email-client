import { Transporter } from '../Transporter';
import sendgrid from '@sendgrid/mail';
import PromiseUtil from '@gkampitakis/promise-util';

export default class SendGrid extends Transporter {
	constructor(configuration: { apiKey: string }) {
		super(configuration);
		sendgrid.setApiKey(configuration.apiKey);
	}

	public async send(message: any): Promise<any> {
		return sendgrid.send((await this.messageTransform(message)) as any);
	}

	public get(): any {
		return sendgrid;
	}

	protected async messageTransform(message: any): Promise<Record<string, any>> {
		const { html, text, attachments = [], ...data } = message;

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

		if (attachments.length) data.attachments = await this.processAttachments(attachments);

		return data;
	}

	protected processAttachments(files: any): Promise<{ type: string; filename: string; content: string }> {
		return PromiseUtil.map(files, async (file: any) => {
			const { content, contentType, filename } = await this.getFileData(file);

			return {
				type: contentType,
				filename,
				content: content.toString('base64')
			};
		});
	}
}
