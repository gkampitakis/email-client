import { ClientOptions } from 'postmark/dist/client/models';
import { HelperDelegate } from 'handlebars';
import { AttFile } from './Transporters/Transporter';
/**Template engines supported */
export type TemplateLanguage = 'handlebars' | 'mjml' | 'ejs';
/** Transporters you can use to send email */
export type Transporter = 'SES' | 'sendgrid' | 'postmark' | 'mailgun';
/**Each Transporter has a configuration object type */
export type Configuration = SESConfiguration | SendGridConfiguration | PostmarkConfiguration | MailgunConfiguration;

export interface SESConfiguration {
  /** In case of true or NODE_ENV=production enables caching for template and attachment files */
  production?: boolean;
  /** cache size for template files default = 100 */
  tmpltCacheSize?: number;
  /** cache size for attachment files default = 100 */
  attCacheSize?: number;
  transporter: 'SES';
  /** AWS accessKeyId */
  accessKeyId?: string;
  /** AWS secretAccessKey */
  secretAccessKey?: string;
  /** AWS region */
  region?: string;
  templateLanguage?: TemplateLanguage;
}

export interface SendGridConfiguration {
  /** In case of true or NODE_ENV=production enables caching for template and attachment files */
  production?: boolean;
  /** cache size for template files default = 100 */
  tmpltCacheSize?: number;
  /** cache size for attachment files default = 100 */
  attCacheSize?: number;
  transporter: 'sendgrid';
  /** Sendgrid API key */
  apiKey: string;
  templateLanguage?: TemplateLanguage;
}

export interface PostmarkConfiguration {
  /** In case of true or NODE_ENV=production enables caching for template and attachment files */
  production?: boolean;
  /** cache size for template files default = 100 */
  tmpltCacheSize?: number;
  /** cache size for attachment files default = 100 */
  attCacheSize?: number;
  transporter: 'postmark';
  /** Server Token provided by postmark */
  serverToken: string;
  /** Client options for postmark*/
  configOptions?: ClientOptions.Configuration;
  templateLanguage?: TemplateLanguage;
}

export interface MailgunConfiguration {
  /** In case of true or NODE_ENV=production enables caching for template and attachment files */
  production?: boolean;
  /** cache size for template files default = 100 */
  tmpltCacheSize?: number;
  /** cache size for attachment files default = 100 */
  attCacheSize?: number;
  transporter: 'mailgun';
  /** Mailgun api key */
  apiKey: string;
  /** Mailgun domain */
  domain: string;
  templateLanguage?: TemplateLanguage;
}

/** Email message  */
export interface Message {
  /** Send html, if html and template is present html takes priority */
  html?: string;
  /** Email sender */
  from: string;
  /** Email recipient can be one or multiple */
  to: string | string[];
  /** Path to template */
  template?: string;
  /** Data to be passed on template */
  data?: Record<string, any>;
  /** Sender name */
  name?: string;
  /** Email subject */
  subject?: string;
  /** Send plain text */
  text?: string;
  /** Array of attachments to send with email
   * if not provided name the filename will be used
  */
  attachments?: (AttFile | string)[];
  /** Carbon Copy recipients */
  cc?: string | string[];
  /** Blind Carbon Copy recipients */
  bcc?: string | string[];
  [key: string]: any;
}

/** Pass configuration for handlebars template engine */
export interface HandlebarsConfiguration {
  configure?: (Handlebars) => void;
  helpers?: { name: string; function: HelperDelegate }[];
}

export type DistributiveOmit<T, K extends keyof any> = T extends any ?
  Omit<T, K> : never;