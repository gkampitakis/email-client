import EmailClient from './EmailClient';

jest.mock('../transporters');
jest.mock('fs');
jest.mock('handlebars');
jest.mock('mjml');

describe('EmailClient', () => {
	const { sendgrid: SendGridMock, mailgun: MailGunMock } = jest.requireMock('../transporters').Transporters,
		FsMock = jest.requireMock('fs').Fs,
		HandleBarsMock = jest.requireMock('handlebars').Handlebars,
		{ MjmlCompileSpy } = jest.requireMock('mjml');

	beforeEach(() => {
		MailGunMock.MailGunSendSpy.mockClear();
		MailGunMock.MailGunConstructorSpy.mockClear();
		SendGridMock.SendGridSendSpy.mockClear();
		SendGridMock.SendGridConstructorSpy.mockClear();
		FsMock.ReaddirSyncSpy.mockClear();
		HandleBarsMock.HandlebarsCompileSpy.mockClear();
		HandleBarsMock.HandlebarsTemplateSpy.mockClear();
		MjmlCompileSpy.mockClear();

		FsMock.StaticFiles = [];
	});

	describe('Constructor', () => {
		it('Should instantiate sendgrid transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'sendgrid'
			});

			expect(SendGridMock.SendGridConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should instantiate mailgun transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'mailgun'
			});

			expect(MailGunMock.MailGunConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should throw error if not supported transporter', () => {
			expect.assertions(1);

			try {
				new EmailClient({
					api_key: '',
					//@ts-ignore
					transporter: 'test'
				});
			} catch (error) {
				expect(error).not.toBeUndefined();
			}
		});

		it('Should call the compileTemplates if templateDir is provided', () => {
			FsMock.StaticFiles = ['test.hbs', 'test2.mjml', 'test3.handlebars', 'test4.test'];

			new EmailClient({
				api_key: '',
				transporter: 'sendgrid',
				templateDir: './mockDir'
			});

			expect(FsMock.ReaddirSyncSpy).toHaveBeenNthCalledWith(1, './mockDir');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test.hbs');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test2.mjml');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test3.handlebars');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledTimes(3);
		});

		it('Should not call the compileTemplates if templateDir is not provided', () => {
			new EmailClient({
				api_key: '',
				transporter: 'sendgrid'
			});

			expect(FsMock.ReaddirSyncSpy).not.toHaveBeenCalled();
		});
	});

	describe('Send', () => {
		it('Should not call getCompiledHtml if no template is provided', () => {
			const emailClient = new EmailClient({ api_key: '', transporter: 'sendgrid' });

			emailClient.send({
				from: 'mock@email.com',
				to: 'mock@email.com'
			});

			expect(SendGridMock.SendGridSendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com'
			});
		});

		it('Should call getCompiledHtml if template is provided [handlebars, hbs]', () => {
			FsMock.StaticFiles = ['test.hbs'];

			const emailClient = new EmailClient({ api_key: '', transporter: 'sendgrid', templateDir: './mockDir' });

			emailClient.send({
				from: 'mock@email.com',
				to: 'mock@email.com',
				template: 'test.hbs'
			});

			expect(SendGridMock.SendGridSendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com',
				html: undefined
			});
			expect(HandleBarsMock.HandlebarsTemplateSpy).toHaveBeenCalled();
		});

		it('Should call getCompiledHtml if template is provided [mjml]', () => {
			FsMock.StaticFiles = ['test.mjml'];

			const emailClient = new EmailClient({ api_key: '', transporter: 'sendgrid', templateDir: './mockDir' });

			emailClient.send({
				from: 'mock@email.com',
				to: 'mock@email.com',
				template: 'test.mjml'
			});

			expect(SendGridMock.SendGridSendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com',
				html: 'html'
			});
			expect(HandleBarsMock.HandlebarsTemplateSpy).toHaveBeenCalled();
			expect(MjmlCompileSpy).toHaveBeenCalled();
		});

		it('Should throw error if the requested template was not present on the directory', () => {
			const emailClient = new EmailClient({ api_key: '', transporter: 'sendgrid' });

			expect.assertions(1);

			try {
				emailClient.send({
					from: 'mock@email.com',
					to: 'mock@email.com',
					template: 'test'
				});
			} catch (error) {
				expect(error).not.toBeUndefined();
			}
		});
	});

	describe('Transporter', () => {
		it('Should instantiate sendgrid transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'sendgrid'
			});

			expect(SendGridMock.SendGridConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should instantiate mailgun transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'mailgun'
			});

			expect(MailGunMock.MailGunConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should throw error if not supported transporter', () => {
			expect.assertions(1);

			try {
				new EmailClient({
					api_key: '',
					//@ts-ignore
					transporter: 'test'
				});
			} catch (error) {
				expect(error).not.toBeUndefined();
			}
		});
	});

	describe('SetTemplates', () => {
		it('Should call the compileTemplates if templateDir is provided', () => {
			FsMock.StaticFiles = ['test.hbs', 'test2.mjml', 'test3.handlebars', 'test4.test'];

			new EmailClient({
				api_key: '',
				transporter: 'sendgrid',
				templateDir: './mockDir'
			});

			expect(FsMock.ReaddirSyncSpy).toHaveBeenNthCalledWith(1, './mockDir');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test.hbs');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test2.mjml');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledWith('./mockDir/test3.handlebars');
			expect(HandleBarsMock.HandlebarsCompileSpy).toHaveBeenCalledTimes(3);
		});

		it('Should not call the compileTemplates if templateDir is not provided', () => {
			new EmailClient({
				api_key: '',
				transporter: 'sendgrid'
			});

			expect(FsMock.ReaddirSyncSpy).not.toHaveBeenCalled();
		});
	});

	describe('configureHandlebars', () => {
		it('Should call registerHelper', () => {
			const client = new EmailClient({
					api_key: '',
					transporter: 'sendgrid',
					templateDir: './mockDir'
				}),
				helpers = [
					{
						name: 'mock',
						// eslint-disable-next-line
						function: () => {}
					},
					{
						name: 'mock',
						// eslint-disable-next-line
						function: () => {}
					}
				];

			client.configureHandlebars({ helpers });

			expect(HandleBarsMock.RegisterHelperSpy).toHaveBeenCalledTimes(2);
		});

		it('Should call the configure function', () => {
			const client = new EmailClient({
					api_key: '',
					transporter: 'sendgrid',
					templateDir: './mockDir'
				}),
				configure = jest.fn();

			client.configureHandlebars({ configure });

			expect(configure).toHaveBeenCalledTimes(1);
		});
	});
});
