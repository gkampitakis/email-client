import SendGrid from './SendGrid/SendGrid';
import MailGun from './MailGun/MailGun';
import Postmark from './Postmark/Postmark';
import Mandrill from './Mandrill/Mandrill';
import AwsSES from './AwsSES/AwsSES';

export const Transporters = {
	sendgrid: SendGrid,
	mailgun: MailGun,
	postmark: Postmark,
	mandrill: Mandrill,
	aws: AwsSES
};
