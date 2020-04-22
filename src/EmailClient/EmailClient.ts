import MailGun from '../transporters/MailGun/MailGun';
import SendGrid from '../transporters/SendGrid/SendGrid';
import { Transporters } from '../Transporters';
import { File } from '../Transporters/Transporter';
import fs from 'fs';
import handlebars, { HelperDelegate } from 'handlebars';
import mjml2html from 'mjml';
import Mandrill from '../Transporters/Mandrill/Mandrill';
import Postmark from '../Transporters/Postmark/Postmark';
import AwsSES from '../Transporters/AwsSES/AwsSES';

interface EmailClientConfiguration extends ExtendableObject {
	transporter: Transporter;
	api_key?: string;
	templateDir?: string;
}

type Transporter = 'mailgun' | 'sendgrid' | 'postmark' | 'mandrill' | 'aws';

interface ExtendableObject {
	[key: string]: any;
}

interface Message {
	from: string;
	to: string | string[];
	template?: string;
	data?: object;
	name?: string;
	subject?: string;
	text?: string;
	attachments?: File[];
	cc?: string | string[];
	bcc?: string | string[];
}

interface HandlebarsConfiguration {
	configure?: (Handlebars) => void;
	helpers?: { name: string; function: HelperDelegate }[];
}

export default class EmailClient {
	//@ts-ignore
	private _transporter: MailGun | SendGrid | Mandrill | Postmark | AwsSES;
	private static templates: Map<string, HandlebarsTemplateDelegate<any>> = new Map();
	private static handlebars = handlebars;

	constructor(configuration: EmailClientConfiguration) {
		const { transporter, templateDir, ...rest } = configuration;
		this.setTransporter(transporter, rest);
		this.setTemplates(templateDir);
	}

	public async send(message: Message & ExtendableObject): Promise<any> {
		return this._transporter.send(await this.constructMessage(message));
	}

	public setTransporter(transporter: Transporter, configuration: any) {
		if (!Transporters[transporter])
			throw new Error(
				'Not supported transporter' +
					transporter +
					'.\nCurrently you can use [Sendgrid, Mailgun,AwsSES,Mandrill,Postmark]'
			);
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

	private async constructMessage(message: Message & ExtendableObject): Promise<{}> {
		// eslint-disable-next-line prefer-const
		let { template, html, data, cc, bcc, to, ...rest } = message;

		if (template) {
			html = this.getCompiledHtml(template, data);
		}

		if (cc) cc = this.transformString2Array(cc);
		if (bcc) bcc = this.transformString2Array(bcc);
		to = this.transformString2Array(to);

		return {
			...(cc && { cc }),
			...(bcc && { bcc }),
			...(html && { html }),
			to,
			...rest
		};
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

				EmailClient.templates.set(fileName, EmailClient.handlebars.compile(file));
			});
	}

	private isSupportedFileType(file: any): boolean {
		return file.includes('.hbs') || file.includes('.handlebars') || file.includes('.mjml');
	}

	private transformString2Array(value: string | string[]): string[] {
		if (typeof value === 'string') return [value];
		return value as string[];
	}

	private getTransporterName(): string {
		return this._transporter.get().constructor.name;
	}
}
