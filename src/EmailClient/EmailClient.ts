import { Transporters } from '../transporters';
import MailGun from '../transporters/MailGun/MailGun';
import SendGrid from '../transporters/SendGrid/SendGrid';
import fs from 'fs';
import handlebars from 'handlebars';
import mjml2html from 'mjml';

interface EmailClientConfiguration {
	transporter: Transporter;
	api_key: string;
	templateDir: string;
}

type Transporter = 'mailgun' | 'sendgrid';

interface ExtendableObject {
	[key: string]: any;
}

interface Message {
	from: string;
	to: string;
	template?: string;
	data?: object;
}

export default class EmailClient {
	private static _transporter: MailGun | SendGrid;
	private static templates: Map<string, HandlebarsTemplateDelegate<any>> = new Map();

	constructor(configuration: EmailClientConfiguration) {
		const { transporter, templateDir } = configuration;
		EmailClient._transporter = new Transporters[transporter](configuration);
		this.setTemplates(templateDir);
	}

	public send(message: Message & ExtendableObject): Promise<any> {
		if (message.template) {
			message.html = this.getCompiledHtml(message.template, message.data);
			delete message.template;
		}

		return EmailClient._transporter.send(message);
	}

	public transporter(transporter: Transporter, configuration: any) {
		EmailClient._transporter = new Transporters[transporter](configuration);
	}

	public setTemplates(templateDir: string) {
		if (!templateDir) return;

		EmailClient.templates.clear();

		this.compileTemplates(templateDir);
	}

	private getCompiledHtml(templateName: string, data: any) {
		const template = EmailClient.templates.get(templateName);
		if (!template)
			throw new Error(
				`${templateName} not found on directory.Verify the path and the supported types[*.hbs, *.handlebars, *.mjml]`
			);

		return templateName.includes('.mjml') ? mjml2html(template(data)).html : template(data);
	}

	private compileTemplates(templateDir: string): void {
		fs.readdirSync(templateDir)
			.filter((file) => this.isSupportedFileType(file))
			.forEach((fileName) => {
				const file = fs.readFileSync(`${templateDir}/${fileName}`, { encoding: 'utf-8' });

				EmailClient.templates.set(fileName, handlebars.compile(file));
			});
	}

	private isSupportedFileType(file: any): boolean {
		return file.includes('.hbs') || file.includes('.handlebars') || file.includes('.mjml');
	}
}
//TODO: investigate the handlebars helpers
