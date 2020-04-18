# Email Client

[![Codecov Coverage](https://img.shields.io/codecov/c/github/gkampitakis/email-client)](https://codecov.io/gh/gkampitakis/email-client)

A library written in typescript. using various clients in order to send emails from your nodejs server. Supports the send of html template as well.

## Usage

### Send an email

```javascript
import { EmailClient } from '@gkampitakis/email-client';

const client = new EmailClient({
	transporter: 'sendgrid', // Supported 'sendgrid', 'mailgun', 'postmark', 'mandrill'
	apik_key: '', //Your api key depending on each client provider
	templateDir: '/path/to/your/email/templates'
	//... any other provider specific configuration
});

await client.send({
	to: 'to@email.com',
	from: 'from@email.com',
	subject: 'A subject',
	text: 'A text',
	template: 'template.hbs' // optional this name must match to a file in the templateDir you have specified
});
```

### Email Client Methods

```javascript

const client = new EmailClient({...});

/*Exposes handlebars configuration method*/
client.configureHandlebars({
	configure:()=>void,
	helpers:[]
});

/*Set a new transporter*/
client.setTransporter('sendgrid',{...});

/*Get the transporter*/
client.getTransporter();

/*Set path for the templates*/
client.setTemplates('/path/to/new/templates');

```

## Dependencies

-   [@sendgrid.mail](https://www.npmjs.com/package/@sendgrid/mail)
-   [mailgun-js](https://www.npmjs.com/package/mailgun-js)
-   [mandrill-api](https://www.npmjs.com/package/mandrill-api)
-   [postmark](https://www.npmjs.com/package/postmark)
-   [mjml](https://www.npmjs.com/package/mjml)
-   [handlebars](https://www.npmjs.com/package/handlebars)

## Suporrted Templates

-   mjml
-   handlebars

## Supported Clients

-   mailgun
-   postmark
-   mandrill
-   sendgrid

## Author and Maintainer

[Georgios Kampitakis](https://github.com/gkampitakis)
