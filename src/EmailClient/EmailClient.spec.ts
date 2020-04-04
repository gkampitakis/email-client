import EmailClient from './EmailClient';

jest.mock('../transporters');
jest.mock('fs');
jest.mock('handlebars');
jest.mock('mjml');

describe('EmailClient', () => {
	const { sendgrid: SendGridMock, mailgun: MailGunMock } = jest.requireMock('../transporters').Transporters,
		FsMock = jest.requireMock('fs').Fs,
		HbsMock = jest.requireMock('handlebars').Hbs,
		{ MjmlCompileSpy } = jest.requireMock('mjml');

	beforeEach(() => {
		MailGunMock.SendSpy.mockClear();
		MailGunMock.ConstructorSpy.mockClear();
		SendGridMock.SendSpy.mockClear();
		SendGridMock.ConstructorSpy.mockClear();
		FsMock.ReaddirSyncSpy.mockClear();
		HbsMock.CompileSpy.mockClear();
		HbsMock.TemplateSpy.mockClear();
		MjmlCompileSpy.mockClear();

		FsMock.StaticFiles = [];
	});

	describe('Constructor', () => {
		it('Should instantiate sendgrid transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'sendgrid'
			});

			expect(SendGridMock.ConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should instantiate mailgun transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'mailgun'
			});

			expect(MailGunMock.ConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
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
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test.hbs');
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test2.mjml');
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test3.handlebars');
			expect(HbsMock.CompileSpy).toHaveBeenCalledTimes(3);
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
			const client = new EmailClient({ api_key: '', transporter: 'sendgrid' });

			client.send({
				from: 'mock@email.com',
				to: 'mock@email.com'
			});

			expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com'
			});
		});

		it('Should call getCompiledHtml if template is provided [handlebars, hbs]', () => {
			FsMock.StaticFiles = ['test.hbs'];

			const client = new EmailClient({ api_key: '', transporter: 'sendgrid', templateDir: './mockDir' });

			client.send({
				from: 'mock@email.com',
				to: 'mock@email.com',
				template: 'test.hbs'
			});

			expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com',
				html: undefined
			});
			expect(HbsMock.TemplateSpy).toHaveBeenCalled();
		});

		it('Should call getCompiledHtml if template is provided [mjml]', () => {
			FsMock.StaticFiles = ['test.mjml'];

			const client = new EmailClient({ api_key: '', transporter: 'sendgrid', templateDir: './mockDir' });

			client.send({
				from: 'mock@email.com',
				to: 'mock@email.com',
				template: 'test.mjml'
			});

			expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
				from: 'mock@email.com',
				to: 'mock@email.com',
				html: 'html'
			});
			expect(HbsMock.TemplateSpy).toHaveBeenCalled();
			expect(MjmlCompileSpy).toHaveBeenCalled();
		});

		it('Should throw error if the requested template was not present on the directory', () => {
			const client = new EmailClient({ api_key: '', transporter: 'sendgrid' });

			expect.assertions(1);

			try {
				client.send({
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

			expect(SendGridMock.ConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
		});

		it('Should instantiate mailgun transporter', () => {
			new EmailClient({
				api_key: '',
				transporter: 'mailgun'
			});

			expect(MailGunMock.ConstructorSpy).toHaveBeenNthCalledWith(1, { api_key: '' });
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
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test.hbs');
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test2.mjml');
			expect(HbsMock.CompileSpy).toHaveBeenCalledWith('./mockDir/test3.handlebars');
			expect(HbsMock.CompileSpy).toHaveBeenCalledTimes(3);
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

			expect(HbsMock.RegisterHelperSpy).toHaveBeenCalledTimes(2);
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
