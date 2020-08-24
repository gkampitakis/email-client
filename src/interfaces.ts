import { ClientOptions } from 'postmark/dist/client/models';
import { HelperDelegate } from 'handlebars';

export type TemplateLanguage = 'handlebars' | 'mjml' | 'ejs';

export type Transporter = 'SES' | 'sendgrid' | 'postmark' | 'mailgun';

export type Configuration = SESConfiguration | SendGridConfiguration | PostmarkConfiguration | MailgunConfiguration;

export interface SESConfiguration {
	transporter: 'SES';
	accessKeyId?: string;
	secretAccessKey?: string;
	region?: string;
	templateLanguage?: TemplateLanguage;
}

export interface SendGridConfiguration {
	transporter: 'sendgrid';
	apiKey: string;
	templateLanguage?: TemplateLanguage;
}

export interface PostmarkConfiguration {
	transporter: 'postmark';
	serverToken: string;
	configOptions?: ClientOptions.Configuration;
	templateLanguage?: TemplateLanguage;
}

export interface MailgunConfiguration {
	transporter: 'mailgun';
	apiKey: string;
	domain: string;
	templateLanguage?: TemplateLanguage;
}

export interface Message {
	from: string;
	to: string | string[];
	template?: string;
	data?: Record<string, any>;
	name?: string;
	subject?: string;
	text?: string;
	attachments?: File[];
	cc?: string | string[];
	bcc?: string | string[];
	[key: string]: any;
}

export interface HandlebarsConfiguration {
	configure?: (Handlebars) => void;
	helpers?: { name: string; function: HelperDelegate }[];
}
