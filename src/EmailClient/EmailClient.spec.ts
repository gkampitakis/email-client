import EmailClient from './EmailClient';

jest.mock('../Transporters');
jest.mock('fs');
jest.mock('handlebars');
jest.mock('mjml');
jest.mock('ejs');
jest.mock('hashlru');

describe('EmailClient', () => {
  const { sendgrid: SendGridMock, mailgun: MailGunMock, postmark: PostmarkMock, SES: AwsSESMock } = jest.requireMock(
    '../Transporters'
  ).Transporters,
    FsMock = jest.requireMock('fs').Fs,
    HbsMock = jest.requireMock('handlebars').Hbs,
    EjsMock = jest.requireMock('ejs').default,
    { MjmlCompileSpy } = jest.requireMock('mjml'),
    { HLRUConstructorSpy } = jest.requireMock('hashlru');

  beforeEach(() => {
    MailGunMock.SendSpy.mockClear();
    MailGunMock.GetSpy.mockClear();
    MailGunMock.ConstructorSpy.mockClear();
    SendGridMock.SendSpy.mockClear();
    SendGridMock.GetSpy.mockClear();
    SendGridMock.ConstructorSpy.mockClear();
    FsMock.ReaddirSyncSpy.mockClear();
    HbsMock.CompileSpy.mockClear();
    HbsMock.TemplateSpy.mockClear();
    MjmlCompileSpy.mockClear();
    PostmarkMock.ConstructorSpy.mockClear();
    AwsSESMock.GetSpy.mockClear();
    AwsSESMock.ConstructorSpy.mockClear();
    AwsSESMock.SendSpy.mockClear();
    EjsMock.CompileSpy.mockClear();
    EjsMock.TemplateSpy.mockClear();
    HLRUConstructorSpy.mockClear();

    FsMock.StaticFiles = [];
    process.env.NODE_ENV = 'test';
  });

  describe('Constructor', () => {
    it('Should instantiate sendgrid transporter', () => {
      new EmailClient({
        apiKey: 'mockKey',
        templateLanguage: 'ejs',
        transporter: 'sendgrid'
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(100);
      expect(SendGridMock.ConstructorSpy).toHaveBeenNthCalledWith(1, { apiKey: 'mockKey', attCacheSize: 100, production: false });
    });

    it('Should instantiate mailgun transporter', () => {
      new EmailClient({
        apiKey: 'mockKey',
        domain: 'mockDomain',
        templateLanguage: 'ejs',
        transporter: 'mailgun'
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(100);
      expect(MailGunMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        apiKey: 'mockKey',
        domain: 'mockDomain',
        attCacheSize: 100,
        production: false
      });
    });

    it('Should instantiate postmark transporter', () => {
      new EmailClient({
        serverToken: 'mockToken',
        configOptions: {} as any,
        templateLanguage: 'ejs',
        transporter: 'postmark'
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(100);
      expect(PostmarkMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        serverToken: 'mockToken',
        configOptions: {},
        attCacheSize: 100,
        production: false
      });
    });

    it('Should instantiate SES transporter', () => {
      new EmailClient({
        accessKeyId: 'mockKey',
        region: 'mockRegion',
        secretAccessKey: 'mockSecret',
        templateLanguage: 'ejs',
        transporter: 'SES'
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(100);
      expect(AwsSESMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        accessKeyId: 'mockKey',
        region: 'mockRegion',
        secretAccessKey: 'mockSecret',
        attCacheSize: 100,
        production: false
      });
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
        expect(error.message).toBe(
          `Not supported transporter [test].\nCurrently you can use [Sendgrid, Mailgun, SES, Postmark]`
        );
      }
    });

    it('Should throw error if not support template language', () => {
      expect.assertions(1);

      try {
        new EmailClient({
          //@ts-ignore
          templateLanguage: 'test',
          transporter: 'SES'
        });
      } catch (error) {
        expect(error.message).toBe('Not supported template language');
      }
    });

    it('Should initiate transporter with production and cache sizes', () => {
      new EmailClient({
        serverToken: 'mockToken',
        configOptions: {} as any,
        templateLanguage: 'ejs',
        transporter: 'postmark',
        attCacheSize: 10,
        tmpltCacheSize: 15,
        production: true
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(15);
      expect(PostmarkMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        serverToken: 'mockToken',
        configOptions: {},
        attCacheSize: 10,
        production: true
      });
    });

    it('Should infer production from NODE_ENV', () => {
      process.env.NODE_ENV = 'production';

      new EmailClient({
        serverToken: 'mockToken',
        configOptions: {} as any,
        templateLanguage: 'ejs',
        transporter: 'postmark'
      });

      expect(HLRUConstructorSpy).toHaveBeenCalledWith(100);
      expect(PostmarkMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        serverToken: 'mockToken',
        configOptions: {},
        attCacheSize: 100,
        production: true
      });
    });
  });

  describe('Send', () => {
    it('Should ignore template if html attribute is provided', async () => {
      const client = new EmailClient({ apiKey: 'mockKey', transporter: 'sendgrid', templateLanguage: 'ejs' });

      await client.send({
        from: 'mock@email.com',
        to: 'mock@email.com',
        html: '<div>Hello World</div>',
        template: '/path/two/template'
      });

      expect(FsMock.ReaddirSyncSpy).not.toHaveBeenCalled();
      expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
        from: 'mock@email.com',
        to: ['mock@email.com'],
        html: '<div>Hello World</div>'
      });
    });

    it('Should not call getCompiledHtml if no template is provided', async () => {
      const client = new EmailClient({ apiKey: 'mockKey', transporter: 'sendgrid', templateLanguage: 'ejs' });

      await client.send({
        from: 'mock@email.com',
        to: 'mock@email.com'
      });

      expect(FsMock.ReaddirSyncSpy).not.toHaveBeenCalled();
      expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
        from: 'mock@email.com',
        to: ['mock@email.com']
      });
    });

    it('Should print warning if template provided without template language', async () => {
      const client = new EmailClient({ apiKey: 'mockKey', transporter: 'sendgrid' }),
        warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await client.send({
        from: 'mock@email.com',
        to: 'mock@email.com',
        template: '/mock/template'
      });

      expect(warnSpy).toHaveBeenCalledWith('Missing template language,templates will not be compiled!');
    });

    it('Should call getCompiledHtml if template is provided [handlebars]', async () => {
      FsMock.StaticFiles = ['hbs'];

      const client = new EmailClient({
        apiKey: '',
        transporter: 'sendgrid',
        templateLanguage: 'handlebars'
      });

      await client.send({
        from: 'mock@email.com',
        to: 'mock@email.com',
        template: 'hbs',
        cc: 'test@mail.com',
        bcc: ['test@mail.com']
      });

      expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
        from: 'mock@email.com',
        to: ['mock@email.com'],
        html: 'html',
        cc: ['test@mail.com'],
        bcc: ['test@mail.com']
      });
      expect(HbsMock.TemplateSpy).toHaveBeenCalled();
    });

    it('Should call getCompiledHtml if template is provided [mjml]', async () => {
      FsMock.StaticFiles = ['mjml'];

      const client = new EmailClient({
        apiKey: '',
        transporter: 'sendgrid',
        templateLanguage: 'mjml'
      });

      await client.send({
        from: 'mock@email.com',
        to: ['mock@email.com'],
        template: 'mjml'
      });

      expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
        from: 'mock@email.com',
        to: ['mock@email.com'],
        html: 'html'
      });
      expect(HbsMock.TemplateSpy).toHaveBeenCalled();
      expect(MjmlCompileSpy).toHaveBeenCalled();
    });

    it('Should call getCompiledHtml if template is provided [ejs]', async () => {
      FsMock.StaticFiles = ['ejs'];

      const client = new EmailClient({
        apiKey: '',
        transporter: 'sendgrid',
        templateLanguage: 'ejs'
      });

      await client.send({
        from: 'mock@email.com',
        to: ['mock@email.com'],
        template: 'ejs'
      });

      expect(SendGridMock.SendSpy).toHaveBeenNthCalledWith(1, {
        from: 'mock@email.com',
        to: ['mock@email.com'],
        html: 'htmlEJS'
      });
      expect(EjsMock.TemplateSpy).toHaveBeenCalled();
      expect(EjsMock.CompileSpy).toHaveBeenCalled();
    });

    it('Should use empty values on construct message', async () => {
      const client = new EmailClient({
        transporter: 'SES',
        templateLanguage: 'ejs'
      });

      await client.send({
        from: 'mock@email.com',
        to: 'mock@email.com',
        cc: 'mock@email.com',
        data: {},
        html: ''
      });

      expect(AwsSESMock.SendSpy).toHaveBeenCalledWith({
        from: 'mock@email.com',
        to: ['mock@email.com'],
        cc: ['mock@email.com']
      });
    });
  });

  describe('SetTransporter', () => {
    it('Should instantiate sendgrid transporter', () => {
      new EmailClient({
        apiKey: 'mockKey',
        transporter: 'sendgrid'
      });

      expect(SendGridMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        apiKey: 'mockKey',
        attCacheSize: 100,
        production: false
      });
    });

    it('Should instantiate postmark transporter', () => {
      new EmailClient({
        serverToken: 'mockToken',
        configOptions: { mock: 'data' } as any,
        transporter: 'postmark'
      });

      expect(PostmarkMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        serverToken: 'mockToken',
        configOptions: { mock: 'data' },
        attCacheSize: 100,
        production: false
      });
    });

    it('Should instantiate mailgun transporter', () => {
      new EmailClient({
        apiKey: 'mockKey',
        domain: '/mock/domain',
        transporter: 'mailgun'
      });

      expect(MailGunMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        apiKey: 'mockKey',
        domain: '/mock/domain',
        attCacheSize: 100,
        production: false
      });
    });

    it('Should instantiate SES transporter', () => {
      new EmailClient({
        transporter: 'SES',
        accessKeyId: 'mockKey',
        secretAccessKey: 'mockAccess',
        region: 'mockRegion'
      });

      expect(AwsSESMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
        accessKeyId: 'mockKey',
        secretAccessKey: 'mockAccess',
        region: 'mockRegion',
        attCacheSize: 100,
        production: false
      });
    });
  });

  describe('GetTransporter', () => {
    it('Should return sendgrid transporter', () => {
      const client = new EmailClient({
        apiKey: 'mockKey',
        transporter: 'sendgrid'
      });

      client.getTransporter();

      expect(SendGridMock.GetSpy).toHaveBeenCalledTimes(1);
    });

    it('Should return mailgun transporter', () => {
      const client = new EmailClient({
        apiKey: 'mockKey',
        domain: '/mock/domain',
        transporter: 'mailgun'
      });

      client.getTransporter();

      expect(MailGunMock.GetSpy).toHaveBeenCalledTimes(1);
    });

    it('Should return postmark transporter', () => {
      const client = new EmailClient({
        serverToken: 'mockToken',
        transporter: 'postmark'
      });

      client.getTransporter();

      expect(PostmarkMock.GetSpy).toHaveBeenCalledTimes(1);
    });

    it('Should return SES transporter', () => {
      const client = new EmailClient({
        transporter: 'SES'
      });

      client.getTransporter();

      expect(AwsSESMock.GetSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('configureHandlebars', () => {
    it('Should call registerHelper', () => {
      const client = new EmailClient({
        apiKey: '',
        transporter: 'sendgrid'
      }),
        helpers = [
          {
            name: 'mock',
            // eslint-disable-next-line
            function: () => { }
          },
          {
            name: 'mock',
            // eslint-disable-next-line
            function: () => { }
          }
        ];

      client.configureHandlebars({ helpers });

      expect(HbsMock.RegisterHelperSpy).toHaveBeenCalledTimes(2);
    });

    it('Should call the configure function', () => {
      const client = new EmailClient({
        apiKey: '',
        transporter: 'sendgrid'
      }),
        configure = jest.fn();

      client.configureHandlebars({ configure });

      expect(configure).toHaveBeenCalledTimes(1);
    });
  });
});
