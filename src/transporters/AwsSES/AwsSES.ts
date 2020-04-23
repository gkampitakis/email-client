import { File, Transporter } from '../Transporter';
import { fromFile } from 'file-type';
import { Credentials, SES, config } from 'aws-sdk';
import MailComposer from 'nodemailer/lib/mail-composer';
import PromiseUtil from '@gkampitakis/promise-util';
import fs from 'fs';

export default class AwsSES extends Transporter {
	private client: SES | undefined;
	constructor(configuration: any) {
		super(configuration);
		this.setupAwsSES(configuration);
	}

	public async send(message: any): Promise<any> {
		const Data = await this.messageTransform(message);

		return this.client!.sendRawEmail({ RawMessage: { Data } }).promise();
	}

	public get(): any {
		return this.client;
	}

	private setupAwsSES(configuration: any) {
		const { api_key: accessKeyId, secret: secretAccessKey, region } = configuration,
			//@ts-ignore
			credentials = new Credentials({ accessKeyId, secretAccessKey });

		config.update({ credentials, region });
		this.client = new SES();
	}

	protected async messageTransform(message: any): Promise<{}> {
		const { from, to, subject, html, text, cc = [], bcc = [], replyTo, attachments = [], ...rest } = message;

		const _attachments = await this.processAttachments(attachments);

		const msg = new MailComposer({
			...(cc.length && { cc: cc.join(',') }),
			...(bcc.length && { bcc: bcc.join(',') }),
			...(to && { to: to.join(',') }),
			...(subject && { subject }),
			...(html && { html }),
			...(text && { text }),
			...(replyTo && { replyTo }),
			...(attachments.length && { attachments: _attachments }),
			from,
			...rest
		});

		return new Promise((resolve, reject) => {
			msg.compile().build((err, message) => {
				if (err) return reject(err);

				resolve(message);
			});
		});
	}

	protected processAttachments(files: File[]): { type: string; filename: string; content: string } {
		return PromiseUtil.map(files, async (file: File) => {
			const result = await fromFile(file.path),
				content = fs.readFileSync(file.path).toString('base64');

			return {
				contentType: result?.mime,
				filename: file.name,
				encoding: 'base64',
				content
			};
		});
	}
}
