import { Transporter } from '../Transporter';
import mandrill from 'mandrill-api/mandrill';

export default class Mandrill extends Transporter {
	private client;

	constructor(configuration: any) {
		super(configuration);
		this.client = new mandrill.Mandrill(configuration.api_key);
	}

	public send(message: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			await this.client.messages.send(
				{ message: this.messageTransform(message), async: true },
				(res) => resolve(res),
				(err) => reject(err)
			);
		});
	}

	public get(): any {
		return this.client;
	}

	protected messageTransform(message: any): {} {
		const { from, name, cc = [], bcc = [], to: _to, _attachments = [], ...rest } = message,
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

		return {
			from_email: message.from,
			from_name: message.name,
			headers: {
				'Reply-To': message.replyTo
			},
			to,
			...(_attachments.length && { attachments: _attachments }),
			...rest
		};
	}
}
