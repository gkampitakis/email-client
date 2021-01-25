# Email Client

[![Build Status](https://travis-ci.com/gkampitakis/email-client.svg?branch=master)](https://travis-ci.com/gkampitakis/email-client)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A library written in typescript using known email clients for sending emails. It has built in support for compiling templates and sending html in the email.

## Usage

### Configuration of client

```javascript
// or with commonjs const EmailClient = require('template-email-client');

import { EmailClient } from 'template-email-client';

const client = new EmailClient({
    transporter: 'sendgrid', // Supported 'sendgrid', 'mailgun', 'postmark', 'SES'
    apiKey: '', //Your send grid api key
    templateLanguage: 'handlebars', // Supported 'handlebars', 'mjml', 'ejs'
    production: true, // or process.env.NODE_ENV = production is as setting to true
    tmpltCacheSize: 50, // template cache size default = 100
    attCacheSize: 50, // attachment cache size default = 100
});
```

> Note that in production mode either by explicitly setting it to true or by setting NODE_ENV = production **template-email-client** will cache template and attachment files.

### Configurations for Transporters

<details><summary> Sendgrid Config</summary>
<p>

```javascript
{
  "transporter": "sendgrid",
	"apiKey": "*******",
  "templateLanguage": "handlebars" // Supported 'handlebars', 'mjml', 'ejs'
}
```

</p>
</details>

<details><summary> Mailgun Config</summary>
<p>

```javascript
{
  "transporter": "mailgun",
	"apiKey": "*******",
  "domain": "/mock/domain",
  "templateLanguage": "handlebars" // Supported 'handlebars', 'mjml', 'ejs'
}
```

</p>
</details>

<details><summary> Postmark Config</summary>
<p>

```javascript
{
  "transporter": "postmark",
	"serverToken": "*******",
  "configOptions": {},
  "templateLanguage": "handlebars" // Supported 'handlebars', 'mjml', 'ejs'
}
```

</p>
</details>

<details><summary> AWS Config</summary>
<p>

```javascript
{
  "transporter": "SES",
	"accessKeyId": "*******",
	"secretAccessKey": "*******",
  "region:": "eu-west-2",
  "templateLanguage": "handlebars" // Supported 'handlebars', 'mjml', 'ejs'
}
```

</p>
</details>

### Send an email

```javascript
client.send({
    from: 'mock@email.com',
    to: 'test@email.com',
    text: 'Hello World',
});
```

### API

-   from `string`
-   to `string` or `string []`
-   cc `string` or `string []`
-   bcc `string` or `string []`
-   text `string`
-   html `string`
-   subject `string`
-   template `string` the path of the html template you want to use
-   data `object` an object containing the data that the template is going to be compiled with
-   subject `string`
-   any other transporter specific field
-   attachments

```javascript
[
    {
        name: 'myfilte.txt', // optional if not provided take filename
        path: __dirname + '/path/to/file',
    },
][
    // or
    (__dirname + '/path/to/file', 'another/file')
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

```

## Supported Templates

-   mjml
-   handlebars
-   ejs

## Supported Clients

-   mailgun
-   postmark
-   sendgrid
-   SES

### Changelog

[CHANGELOG.md](./CHANGELOG.md)

### Example

You can also check an [example](./example) usage.

### Issues

For any [issues](https://github.com/gkampitakis/email-client/issues).

## License

MIT License
