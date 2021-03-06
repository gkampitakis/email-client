import { Transporter } from '../Transporter';
import { Credentials, SES, config } from 'aws-sdk';
import MailComposer from 'nodemailer/lib/mail-composer';

export default class AwsSES extends Transporter {
  private client: SES;

  constructor (configuration: any) {
    super(configuration);

    const { accessKeyId, secretAccessKey, region } = configuration,
      settings = {
        ...(accessKeyId && secretAccessKey && { credentials: new Credentials({ accessKeyId, secretAccessKey }) }),
        ...(region && { region })
      };

    if (Object.keys(settings).length) config.update(settings);

    this.client = new SES();
  }

  public async send (message: any): Promise<any> {
    const data = await this.messageTransform(message);

    return this.client.sendRawEmail({ RawMessage: { Data: data } }).promise();
  }

  public get (): any {
    return this.client;
  }

  protected async messageTransform (message: any): Promise<Record<string, any>> {
    const { from, to, subject, html, text, cc = [], bcc = [], replyTo, attachments = [], ...rest } = message;

    const _attachments = this.processAttachments(attachments);

    const msg = new MailComposer({
      ...(cc.length && { cc: cc.join(',') }),
      ...(bcc.length && { bcc: bcc.join(',') }),
      ...(to && { to: to.join(',') }),
      ...(subject && { subject }),
      ...(html && { html }),
      ...(text && { text }),
      ...(replyTo && { replyTo }),
      ...(attachments.length && { attachments: _attachments }),
      from,
      ...rest
    });

    return new Promise((resolve, reject) => {
      msg.compile().build((err, message) => {
        if (err) return reject(err);

        resolve(message);
      });
    });
  }

  protected processAttachments (files: unknown[]): { contentType: string; filename: string; content: string; encoding: string; }[] {
    return files.map((file: unknown) => {
      const { content, contentType, filename } = this.getFileData(file);

      return {
        contentType,
        filename,
        encoding: 'base64',
        content: content.toString('base64')
      };
    });
  }
}
