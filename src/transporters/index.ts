import SendGrid from './SendGrid/SendGrid';
import MailGun from './MailGun/MailGun';
import Postmark from './Postmark/Postmark';

export const Transporters = {
	sendgrid: SendGrid,
	mailgun: MailGun,
	postmark: Postmark
};
