import EmailClient from './src/EmailClient';

const client = new EmailClient({
    transporter: 'mailgun'
});

client
    .send()
    .then(res => console.log(res));
