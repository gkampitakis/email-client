# Email Client

[![Build Status](https://travis-ci.org/gkampitakis/email-client.svg?branch=master)](https://travis-ci.org/gkampitakis/email-client)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A library written in typescript using known email clients for sending emails. It has built in support for compiling templates and sending html in the email.

## Changelog

[CHANGELOG.md](./CHANGELOG.md)

## Usage

### Configuration of client

```javascript
import { EmailClient } from '@gkampitakis/email-client';

const client = new EmailClient({
	transporter: 'sendgrid', // Supported 'sendgrid', 'mailgun', 'postmark', 'aws'
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
	"api_key": "*******",
	"secret": "*******",
	"region:": "eu-west-2"
}
```

</p>
</details>

<details><summary> Mailgun Config</summary>
<p>

```js
{
	"api_key": "*******",
	"domain": "/mock/domain"
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
    ```js
    [
    	{
    		name: 'myfilte.txt',
    		path: __dirname + '/path/to/file'
    	}
    ];
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

## Suporrted Templates

-   mjml
-   handlebars

## Supported Clients

-   mailgun
-   postmark
-   sendgrid
-   AwsSES

## Author and Maintainer

[Georgios Kampitakis](https://github.com/gkampitakis)

For any [issues](https://github.com/gkampitakis/email-client/issues).
