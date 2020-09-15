import EmailClient from '../src';
import path from 'path';

const client = new EmailClient({
  transporter: 'postmark', // 'SES', 'sendgrid', 'mailgun'
  serverToken: '',
  templateLanguage: 'handlebars' // 'mjml', 'ejs'
});

client
  .send({
    from: 'mock@email.com',
    to: 'mock@email.com',
    text: 'hello world',
    subject: 'hello world',
    template: path.resolve(__dirname, './templates/test.hbs'),
    data: {
      user: {
        name: 'my name'
      }
    },
    attachments: [{
      path: path.resolve(__dirname, './templates/test.hbs'),
      name: 'templateFile.hbs'
    }]
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

