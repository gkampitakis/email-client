import { File, Transporter } from '../Transporter';
import { fromFile } from 'file-type';
import sendgrid from '@sendgrid/mail';
import PromiseUtil from '@gkampitakis/promise-util';
import fs from 'fs';

export default class SendGrid extends Transporter {
	constructor(configuration: any) {
		super(configuration);
		sendgrid.setApiKey(configuration.api_key);
	}

	public async send(message: any): Promise<any> {
		return sendgrid.send((await this.messageTransform(message)) as any);
	}

	public get(): any {
		return sendgrid;
	}

	protected async messageTransform(message: any): Promise<{}> {
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

	protected processAttachments(files: File[]): Promise<{ type: string; filename: string; content: string }> {
		return PromiseUtil.map(files, async (file: File) => {
			const result = await fromFile(file.path),
				content = fs.readFileSync(file.path).toString('base64');

			return {
				type: result?.mime,
				filename: file.name,
				content
			};
		});
	}
}
