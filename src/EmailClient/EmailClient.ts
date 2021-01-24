import MailGun from '../Transporters/MailGun/MailGun';
import SendGrid from '../Transporters/SendGrid/SendGrid';
import Postmark from '../Transporters/Postmark/Postmark';
import AwsSES from '../Transporters/AwsSES/AwsSES';
import { Transporters } from '../Transporters';
import {
  Configuration,
  DistributiveOmit,
  HandlebarsConfiguration,
  Message,
  TemplateLanguage,
  Transporter
} from '../interfaces';
import handlebars from 'handlebars';
import mjml2html from 'mjml';
import ejs from 'ejs';
import fs from 'fs';
import HLRU from 'hashlru';

export default class EmailClient {
  //@ts-ignore
  private _transporter: MailGun | SendGrid | Postmark | AwsSES;
  private readonly templateLng?: TemplateLanguage;
  private readonly handlebars = handlebars;
  private production: boolean;
  private LRU;
  private readonly compilers = {
    mjml: this.mjmlCompile.bind(this),
    handlebars: this.handlebarsCompile.bind(this),
    ejs: this.ejsCompile.bind(this)
  };

  constructor (configuration: Configuration) {
    const { transporter, production, tmpltCacheSize, attCacheSize, templateLanguage, ...rest } = configuration;

    if (templateLanguage && !this.compilers[templateLanguage]) throw new Error('Not supported template language');

    this.production = typeof production === 'boolean' ? production : process.env.NODE_ENV === 'production';
    this.LRU = HLRU(tmpltCacheSize || 100);
    this.templateLng = templateLanguage;
    this.setTransporter(transporter, { ...rest, production: this.production, attCacheSize: attCacheSize || 100 });
  }
  /** Send email method */
  public async send (message: Message) {
    if (message.template && !this.templateLng)
      console.warn('Missing template language,templates will not be compiled!');
    return this._transporter.send(this.constructMessage(message, this.templateLng));
  }

  /** Change Transporter */
  public setTransporter (
    transporter: Transporter,
    configuration: DistributiveOmit<Configuration, 'transporter' | 'templateLanguage' | 'tmpltCacheSize'>
  ) {
    if (!Transporters[transporter])
      throw new Error(
        'Not supported transporter [' +
        transporter +
        '].\nCurrently you can use [Sendgrid, Mailgun, SES, Postmark]'
      );
    this._transporter = new Transporters[transporter](configuration);
  }

  /** Get Transporter object */
  public getTransporter () {
    return this._transporter.get();
  }

  /** Set configuration methods for handlebars */
  public configureHandlebars (configuration: HandlebarsConfiguration) {
    const { configure, helpers = [] } = configuration;

    helpers.forEach((helper) => this.handlebars.registerHelper(helper.name, helper.function));

    if (configure) configure(this.handlebars);
  }

  private constructMessage (message: Message, templateLng?: TemplateLanguage): Record<string, any> {
    // eslint-disable-next-line prefer-const
    let { template = '', html = '', data = {}, cc, bcc, to, ...rest } = message;

    if (template && templateLng && !html) html = this.compilers[templateLng](template, data);
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

  private mjmlCompile (template: string, data: unknown): string {
    let compiled = this.LRU.get(template);

    if (!this.production || !compiled) {
      const file = fs.readFileSync(template, { encoding: 'utf-8' });
      compiled = this.handlebars.compile(file);

      this.LRU.set(template, compiled);
    }

    return mjml2html(compiled(data)).html;
  }

  private handlebarsCompile (template: string, data: unknown): string {
    let compiled = this.LRU.get(template);

    if (!this.production || !compiled) {
      const file = fs.readFileSync(template, { encoding: 'utf-8' });
      compiled = this.handlebars.compile(file);

      this.LRU.set(template, compiled);
    }

    return compiled(data);
  }

  private ejsCompile (template: string, data: any): string {
    let compiled = this.LRU.get(template);

    if (!this.production || !compiled) {
      const file = fs.readFileSync(template, { encoding: 'utf-8' });
      compiled = ejs.compile(file);

      this.LRU.set(template, compiled);
    }

    return compiled(data);
  }

  private transformString2Array (value: string | string[]): string[] {
    if (typeof value === 'string') return [value];
    return value as string[];
  }
}
