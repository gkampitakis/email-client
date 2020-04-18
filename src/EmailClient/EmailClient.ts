import { Transporters } from '../transporters';
import MailGun from '../transporters/MailGun/MailGun';
import SendGrid from '../transporters/SendGrid/SendGrid';
import fs from 'fs';
import handlebars, { HelperDelegate } from 'handlebars';
import mjml2html from 'mjml';
import Mandrill from '../transporters/Mandrill/Mandrill';
import Postmark from '../transporters/Postmark/Postmark';

interface EmailClientConfiguration extends ExtendableObject {
	transporter: Transporter;
	api_key: string;
	templateDir?: string;
}

type Transporter = 'mailgun' | 'sendgrid' | 'postmark' | 'mandrill';

interface ExtendableObject {
	[key: string]: any;
}

interface Message {
	from: string;
	to: string;
	template?: string;
	data?: object;
	name?: string;
}

interface HandlebarsConfiguration {
	configure?: (Handlebars) => void;
	helpers?: { name: string; function: HelperDelegate }[];
}

export default class EmailClient {
	//@ts-ignore
	private _transporter: MailGun | SendGrid | Mandrill | Postmark;
	private static templates: Map<string, HandlebarsTemplateDelegate<any>> = new Map();
	private static handlebars = handlebars;

	constructor(configuration: EmailClientConfiguration) {
		const { transporter, templateDir, ...rest } = configuration;
		this.setTransporter(transporter, rest);
		this.setTemplates(templateDir);
	}

	public send(message: Message & ExtendableObject): Promise<any> {
		if (message.template) {
			message.html = this.getCompiledHtml(message.template, message.data);
			delete message.template;
		}
		return this._transporter.send(message);
	}

	public setTransporter(transporter: Transporter, configuration: any) {
		if (!Transporters[transporter])
			throw new Error('Not supported transporter' + transporter + '.\nCurrently you can use [Sendgrid, Mailgun]');
		this._transporter = new Transporters[transporter](configuration);
	}

	public getTransporter(): any {
		return this._transporter.get();
	}

	public setTemplates(templateDir: string | undefined) {
		if (!templateDir) return;

		EmailClient.templates.clear();

		this.compileTemplates(templateDir);
	}

	public configureHandlebars(configuration: HandlebarsConfiguration) {
		const { configure, helpers = [] } = configuration;

		helpers.forEach((helper) => EmailClient.handlebars.registerHelper(helper.name, helper.function));

		if (configure) configure(EmailClient.handlebars);
	}

	private getCompiledHtml(templateName: string, data: any) {
		const template = EmailClient.templates.get(templateName);
		if (!template)
			throw new Error(
				`${templateName} not found on directory.Verify the path and the supported types[*.hbs, *.handlebars, *.mjml]`
			);
		//TODO: refactor if more template libraries are supported
		return templateName.includes('.mjml') ? mjml2html(template(data)).html : template(data);
	}

	private compileTemplates(templateDir: string): void {
		fs.readdirSync(templateDir)
			.filter((file) => this.isSupportedFileType(file))
			.forEach((fileName) => {
				const file = fs.readFileSync(`${templateDir}/${fileName}`, { encoding: 'utf-8' });

				EmailClient.templates.set(fileName, EmailClient.handlebars.compile(file));
			});
	}

	private isSupportedFileType(file: any): boolean {
		return file.includes('.hbs') || file.includes('.handlebars') || file.includes('.mjml');
	}
}
