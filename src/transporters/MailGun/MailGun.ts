import { Transporter } from '../Transporter';
import mailgun from 'mailgun-js';

interface MailgunAuth {
	api_key: string;
	domain: string;
}

export default class MailGun extends Transporter {
	private mailGun: any;

	constructor(configuration: any) {
		super(configuration);
		this.setupMailgun(configuration);
	}

	public send(message: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.mailGun.messages().send(message, (err: Error, body: any) => {
				if (err) return reject(err);

				resolve(body);
			});
		});
	}

	public get(): any {
		return this.mailGun;
	}

	private setupMailgun(auth: Partial<MailgunAuth>) {
		this.mailGun = mailgun({
			apiKey: auth.api_key,
			domain: auth.domain
		});
	}
}
