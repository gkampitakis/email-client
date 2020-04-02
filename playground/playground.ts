import EmailClient from '../src';

const client = new EmailClient({
	transporter: 'sendgrid',
	api_key: '',
	templateDir: __dirname + '/templateDir'
});

client
	.send({
		to: 'gkabitakis@gmail.com',
		from: 'test@example.com',
		subject: 'test',
		text: 'test',
		template: 'template'
	})
	.then((res) => console.log(res))
	.catch((err) => console.log(err.response.body.errors));
