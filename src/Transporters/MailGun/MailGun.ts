import { Transporter } from '../Transporter';
import mailgun from 'mailgun-js';

export default class MailGun extends Transporter {
	private mailGun: any;

	constructor(configuration: { apiKey: string; domain: string }) {
		super(configuration);

		const { apiKey, domain } = configuration;

		this.mailGun = mailgun({
			apiKey,
			domain
		});
	}

	public send(message: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			this.mailGun.messages().send(this.messageTransform(message), (err: Error, body: any) => {
				if (err) return reject(err);

				resolve(body);
			});
		});
	}

	public get(): any {
		return this.mailGun;
	}

	protected messageTransform(message: any): Record<string, any> {
		const { attachments = [], bcc = [], cc = [], to, ...rest } = message;

		const attachment = this.processAttachments(attachments);

		return {
			to: to.join(','),
			...(bcc.length && { bcc: bcc.join(',') }),
			...(cc.length && { cc: cc.join(',') }),
			...(attachments.length && { attachment }),
			...rest
		};
	}

	protected processAttachments(files: any): any {
		return files.map((file: any) => {
			const { content, filename } = this.getFileData(file);

			return new this.mailGun.Attachment({ data: content, filename });
		});
	}
}
