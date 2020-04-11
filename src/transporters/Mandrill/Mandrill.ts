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
				{ message: this.mandrillMessage(message), async: true },
				(res) => resolve(res),
				(err) => reject(err)
			);
		});
	}

	public get(): any {
		return this.client;
	}

	private mandrillMessage(message: any) {
		const { from, name, ...rest } = message;

		return {
			from_email: message.from,
			from_name: message.name,
			headers: {
				'Reply-To': message.replyTo
			},
			...rest
		};
	}
}
