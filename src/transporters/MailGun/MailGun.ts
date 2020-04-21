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
			this.mailGun.messages().send(this.messageTransform(message), (err: Error, body: any) => {
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

	protected messageTransform(message: any): {} {
		const { _attachments = [], ...rest } = message;
		let { bcc = [], cc = [], to } = message;

		bcc = bcc.join(',');
		cc = cc.join(',');
		to = to.join(',');

		const attachment = _attachments.map((element) => new this.mailGun.Attachment(element));

		return {
			...rest,
			...(bcc && { bcc }),
			...(cc && { cc }),
			...(_attachments.length && { attachment }),
			to
		};
	}
}
