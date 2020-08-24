import { Transporter } from '../Transporter';
import { ServerClient } from 'postmark';
import PromiseUtil from '@gkampitakis/promise-util';
import { ClientOptions } from 'postmark/dist/client/models';

export default class Postmark extends Transporter {
	private client;
	constructor(configuration: { serverToken: string; configOptions?: ClientOptions.Configuration }) {
		super(configuration);
		const { serverToken, configOptions } = configuration;
		this.client = new ServerClient(serverToken, configOptions);
	}

	public async send(message: any): Promise<any> {
		return this.client.sendEmail(await this.messageTransform(message));
	}

	public get(): any {
		return this.client;
	}

	protected async messageTransform(message: any): Promise<Record<string, any>> {
		const { from, to, subject, text, html, attachments = [], bcc = [], cc = [], ...rest } = message,
			To = to.join(','),
			Cc = cc.join(','),
			Bcc = bcc.join(',');

		const _attachments = await this.processAttachments(attachments);

		return {
			From: from,
			To,
			...(Bcc && { Bcc }),
			...(Cc && { Cc }),
			...(subject && { Subject: subject }),
			...(text && { TextBody: text }),
			...(html && { HtmlBody: html }),
			...(attachments.length && { attachments: _attachments }),
			...rest
		};
	}

	protected processAttachments(files: any): Promise<{ Name: string; Content: string; ContentType: string }> {
		return PromiseUtil.map(files, async (file: any) => {
			const { content, filename, contentType } = await this.getFileData(file);

			return {
				ContentType: contentType,
				Name: filename,
				Content: content.toString('base64')
			};
		});
	}
}
