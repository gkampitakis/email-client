# Email Client

[![Codecov Coverage](https://img.shields.io/codecov/c/github/gkampitakis/email-client)](https://codecov.io/gh/gkampitakis/email-client) [![Build Status](https://travis-ci.org/gkampitakis/email-client.svg?branch=master)](https://travis-ci.org/gkampitakis/email-client)

A library written in typescript using known email clients for sending emails. It has built in support for compiling templates and sending html in the email.

## Changelog

[CHANGELOG.md](./CHANGELOG.md)

## Usage

### Configuration of client

```javascript
import { EmailClient } from '@gkampitakis/email-client';

const client = new EmailClient({
	transporter: 'sendgrid', // Supported 'sendgrid', 'mailgun', 'postmark', 'mandrill' ,'aws'
	apik_key: '', //Your api key depending on each client provider
	templateDir: __dirname + '/path/to/your/email/templates'
	//... any other provider specific configuration
});
```

### More specific configs for some transporters

<details><summary> AWS Config</summary>
<p>

```json
{
	"api_key":<apiKey>,
	"secret":<secret>,
	"region:"<region>
}
```

</p>
</details>

<details><summary> Mailgun Config</summary>
<p>

```json
{
	"api_key":<apiKey>,
	"domain":<domain>
}
```

</p>
</details>

### Send an email

```javascript
client.send({
	from: 'mock@email.com',
	to: 'test@email.com',
	text: 'Hello World'
});
```

### API

-   from `string`
-   to `string` or `string []`
-   cc `string` or `string []`
-   bcc `string` or `string []`
-   text `string`
-   subject `string`
-   template `string` the filename of the html template you want to use
-   data `object` an object containing the data that the template is going to be compiled with
-   subject `string`
-   any other transporter specific field
-   attachments
    ```json
    [
    	{
    		"name": "myfilte.txt",
    		"path": __dirname + "/path/to/file"
    	}
    ]
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
-   [aws-sdk](https://www.npmjs.com/package/aws-sdk)
-   [mjml](https://www.npmjs.com/package/mjml)
-   [nodemailer](https://www.npmjs.com/package/nodemailer)
-   [handlebars](https://www.npmjs.com/package/handlebars)
-   [promise-util](https://www.npmjs.com/package/@gkampitakis/promise-util)
-   [file-type](https://www.npmjs.com/package/file-type)

## Suporrted Templates

-   mjml
-   handlebars

## Supported Clients

-   mailgun
-   postmark
-   mandrill **This transporter is not yet properly tested!!**
-   sendgrid
-   AwsSES

## Author and Maintainer

[Georgios Kampitakis](https://github.com/gkampitakis)
