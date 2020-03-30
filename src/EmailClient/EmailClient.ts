// import { Transporter, createTransport } from 'nodemailer';
// import sendGrid from 'nodemailer-sendgrid';
// import hbs from 'nodemailer-express-handlebars';
// import validator from 'validator';
// import path from 'path';

// export interface EmailClientConfig {
// 	sendGridApiKey: string;
// 	sender: string;clear 
// 	supportedEmailTypes: string[];
// 	templatesFolder: string;
// }

// export class EmailClient {
// 	private static config: EmailClientConfig;

// 	constructor() {
// 		this.send = this.send.bind(this);
// 	}

// 	public async send(receiver: string, subject: string, payload: any, type: string): Promise<any> {
// 		this.configError();
// 		if (!validator.isEmail(receiver)) throw Error('Please support valid email');

// 		const transporter: Transporter = this.createTransporter(type);

// 		const mailPayload = {
// 			from: EmailClient.config.sender,
// 			to: receiver,
// 			subject,
// 			text: payload?.text,
// 			template: type,
// 			context: payload
// 		};

// 		return transporter.sendMail(mailPayload);
// 	}

// 	private createTransporter(type: string): Transporter {
// 		const { templatesFolder, sendGridApiKey, supportedEmailTypes } = EmailClient.config,
// 			transporter: Transporter = createTransport(
// 				sendGrid({
// 					apiKey: sendGridApiKey
// 				})
// 			);

// 		if (!supportedEmailTypes.includes(type)) throw Error('Unsupported email type');

// 		transporter.use(
// 			'compile',
// 			hbs({
// 				viewEngine: {
// 					extName: '.handlebars', // NOTE: stupid placeholders for handlebars package
// 					partialsDir: path.join(process.cwd(), `./${templatesFolder}/`),
// 					layoutsDir: path.join(process.cwd(), `./${templatesFolder}/`),
// 					defaultLayout: type + '.handlebars'
// 				},
// 				viewPath: path.join(process.cwd(), `./${templatesFolder}/`)
// 			})
// 		);

// 		return transporter;
// 	}

// 	static setup(config: EmailClientConfig) {
// 		EmailClient.config = config;
// 	}

// 	private configError() {
// 		if (!EmailClient.config) throw Error('Email provider not initialized');
// 	}
// }


import { Transporters } from '../transporters';

interface EmailClientConfiguration {
    transporter: 'mailgun' | 'sendgrid';
}

export default class EmailClient {

    constructor(configuration: EmailClientConfiguration) {
        return new Transporters[configuration.transporter]({});
    }

    public send(): Promise<any> { return Promise.resolve(); }

}