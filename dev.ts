import EmailClient from './src';

const client = new EmailClient({
    transporter: 'mailgun'
});

client
    .send()
    .then(res => console.log(res));
