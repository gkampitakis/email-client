import MailGun from '../Transporters/MailGun/MailGun';
import SendGrid from '../Transporters/SendGrid/SendGrid';
import Postmark from '../Transporters/Postmark/Postmark';
import AwsSES from '../Transporters/AwsSES/AwsSES';
import { Transporters } from '../Transporters';
import { Configuration, HandlebarsConfiguration, Message, TemplateLanguage, Transporter } from '../interfaces';
import handlebars from 'handlebars';
import mjml2html from 'mjml';
import ejs from 'ejs';
import fs from 'fs';

export default class EmailClient {
	//@ts-ignore
	private _transporter: MailGun | SendGrid | Postmark | AwsSES;
	private readonly templateLng?: TemplateLanguage;
	private readonly handlebars = handlebars;
	private readonly compilers = {
		mjml: this.mjmlCompile.bind(this),
		handlebars: this.handlebarsCompile.bind(this),
		ejs: this.ejsCompile.bind(this)
	};

	constructor(configuration: Configuration) {
		const { transporter, templateLanguage, ...rest } = configuration;

		if (templateLanguage && !this.compilers[templateLanguage]) throw new Error('Not supported template language');

		this.templateLng = templateLanguage;
		this.setTransporter(transporter, rest);
	}

	public async send(message: Message): Promise<any> {
		if (message.template && !this.templateLng)
			console.warn('Missing template language,templates will not be compiled!');
		return this._transporter.send(this.constructMessage(message, this.templateLng));
	}

	public setTransporter(transporter: Transporter, configuration: any) {
		if (!Transporters[transporter])
			throw new Error(
				'Not supported transporter [' +
					transporter +
					'].\nCurrently you can use [Sendgrid, Mailgun, SES, Postmark]'
			);
		this._transporter = new Transporters[transporter](configuration);
	}

	public getTransporter(): any {
		return this._transporter.get();
	}

	public configureHandlebars(configuration: HandlebarsConfiguration) {
		const { configure, helpers = [] } = configuration;

		helpers.forEach((helper) => this.handlebars.registerHelper(helper.name, helper.function));

		if (configure) configure(this.handlebars);
	}

	private constructMessage(message: Message, templateLng?: TemplateLanguage): Record<string, any> {
		// eslint-disable-next-line prefer-const
		let { template = '', html = '', data = {}, cc, bcc, to, ...rest } = message;

		if (template && templateLng) html = this.getCompiledHTML(template, data, templateLng);

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

	private getCompiledHTML(template: string, data: unknown, templateLng: TemplateLanguage): string {
		const file = fs.readFileSync(template, { encoding: 'utf-8' });

		return this.compilers[templateLng](file, data);
	}

	private mjmlCompile(file: string, data: unknown): string {
		const compiled = this.handlebars.compile(file);

		return mjml2html(compiled(data)).html;
	}

	private handlebarsCompile(file: string, data: unknown): string {
		const compiled = this.handlebars.compile(file);

		return compiled(data);
	}

	private ejsCompile(file: string, data: any): string {
		const compiled = ejs.compile(file);

		return compiled(data);
	}

	private transformString2Array(value: string | string[]): string[] {
		if (typeof value === 'string') return [value];
		return value as string[];
	}
}
