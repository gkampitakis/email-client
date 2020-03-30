import SendGrid from './SendGrid/SendGrid';
import MailGun from './MailGun/MailGun';

export const Transporters = {
    sendgrid: SendGrid,
    mailgun: MailGun
};