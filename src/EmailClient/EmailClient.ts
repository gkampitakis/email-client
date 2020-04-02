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
			message.html = this.getTemplate(message.template); //NOTE: rename not appropriate naming //BUG: not passing down the data to be compiled
			delete message.template;
		}

		return EmailClient._transporter.send(message);
	}

	public transporter(transporter: Transporter, configuration: any) {
		EmailClient._transporter = new Transporters[transporter](configuration);
	}

	public setTemplates(templateDir: string) {
		if (!templateDir) return;
		this.compileTemplates(templateDir);
	}

	private getTemplate(templateName: string) {
		const template = EmailClient.templates.get(templateName);
		if (!template)
			throw new Error(
				`${templateName} not found on directory.Verify the path and the supported types[*.hbs, *.handlebars, *.mjml]`
			);

		return mjml2html(template({})).html; //BUG: this won't work with the hbs file
	}

	private compileTemplates(templateDir: string) {
		// TODO add the compiled file to the Map

		const { hbs, mjml } = this.getByFileTypes(templateDir);

		hbs.forEach((fileName: string) => {
			//NOTE: this probably needs to be implemented with other way
			//Throw error if the template already exists and clear the template map if this file is reset
			const file = fs.readFileSync(`${templateDir}/${fileName}`, { encoding: 'utf-8' });

			EmailClient.templates.set(fileName.replace('.hbs', ''), handlebars.compile(file));
		});

		mjml.forEach((fileName: string) => {
			const file = fs.readFileSync(`${templateDir}/${fileName}`, { encoding: 'utf-8' });

			EmailClient.templates.set(fileName.replace('.mjml', ''), handlebars.compile(file));
		});
	}

	private getByFileTypes(templateDir: string): { hbs: []; mjml: [] } {
		return fs
			.readdirSync(templateDir)
			.filter((file) => this.isSupportedFileType(file))
			.reduce(
				(result: any, entry) => {
					if (entry.includes('.hbs')) {
						return {
							hbs: [...result.hbs, entry],
							mjml: result.mjml
						};
					}

					return {
						hbs: result.hbs,
						mjml: [...result.mjml, entry]
					};
				},
				{ hbs: [], mjml: [] }
			);
	}

	private isSupportedFileType(file: any): boolean {
		return file.includes('.hbs') || file.includes('.mjml');
	}
}
//TODO: investigate the handlebars helpers
