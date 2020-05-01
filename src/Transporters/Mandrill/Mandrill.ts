import { File, Transporter } from '../Transporter';
import { fromFile } from 'file-type';
import mandrill from 'mandrill-api/mandrill';
import PromiseUtil from '@gkampitakis/promise-util';
import fs from 'fs';

export default class Mandrill extends Transporter {
	private client;

	constructor(configuration: any) {
		super(configuration);
		this.client = new mandrill.Mandrill(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const msg = await this.messageTransform(message);
			await this.client.messages.send(
				{ message: msg, async: true },
				(res) => resolve(res),
				(err) => reject(err)
			);
		});
	}

	public get(): any {
		return this.client;
	}

	protected async messageTransform(message: any): Promise<{}> {
		const { from, name, replyTo, cc = [], bcc = [], to: _to, attachments = [], ...rest } = message,
			to: { email: string; type: 'to' | 'cc' | 'bcc' }[] = [];

		to.push({
			email: _to,
			type: 'to'
		});

		cc.forEach((recipient) => {
			to.push({
				email: recipient,
				type: 'cc'
			});
		});

		bcc.forEach((recipient) => {
			to.push({
				email: recipient,
				type: 'bcc'
			});
		});

		const _att = await this.processAttachments(attachments);

		return {
			from_email: message.from,
			...(name && { from_name: name }),
			...(replyTo && {
				headers: {
					'Reply-To': replyTo
				}
			}),
			to,
			...(attachments.length && { attachments: _att }),
			...rest
		};
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
