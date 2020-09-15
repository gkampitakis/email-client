import AwsSES from './AwsSES';

jest.mock('aws-sdk');
jest.mock('fs');
jest.mock('mime-types');
jest.mock('nodemailer/lib/mail-composer');

describe('AwsSES', () => {
  const { CredentialsSpy, SESSpy, SendRawEmailSpy, ConfigUpdateSpy, SES: SESMock } = jest.requireMock('aws-sdk'),
    { LookupSpy, SRC } = jest.requireMock('mime-types'),
    FsMock = jest.requireMock('fs').Fs,
    MailComposerMock = jest.requireMock('nodemailer/lib/mail-composer').MailComposer;

  beforeEach(() => {
    CredentialsSpy.mockClear();
    SESSpy.mockClear();
    SendRawEmailSpy.mockClear();
    ConfigUpdateSpy.mockClear();
    LookupSpy.mockClear();
    FsMock.ReadFileSyncSpy.mockClear();
    MailComposerMock.ConstructorSpy.mockClear();

    MailComposerMock.BuildError = false;
    SRC.result = true;
  });

  it('Should initialize AwsSES', () => {
    new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    expect(CredentialsSpy).toHaveBeenNthCalledWith(1, { accessKeyId: 'mockKey', secretAccessKey: 'mockKey' });
    expect(ConfigUpdateSpy).toHaveBeenCalledTimes(1);
    expect(SESSpy).toHaveBeenCalledTimes(1);
  });

  it('Should only update config with provided region', () => {
    new AwsSES({ region: 'mockRegion' });

    expect(CredentialsSpy).not.toHaveBeenCalled();
    expect(ConfigUpdateSpy).toHaveBeenCalledWith({
      region: 'mockRegion'
    });
    expect(SESSpy).toHaveBeenCalled();
  });

  it('Should initialize AwsSES without credentials', () => {
    new AwsSES({});

    expect(CredentialsSpy).not.toHaveBeenCalled();
    expect(ConfigUpdateSpy).not.toHaveBeenCalled();
    expect(SESSpy).toHaveBeenCalledTimes(1);
  });

  it('Should call the send message', async () => {
    const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    await transporter.send({
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: ['you@gmail.com'],
      text: 'text'
    });

    expect(SendRawEmailSpy).toHaveBeenNthCalledWith(1, {
      RawMessage: { Data: 'mockMessage' }
    });
    expect(MailComposerMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: 'you@gmail.com',
      text: 'text'
    });
  });

  it('Should include attachments if present', async () => {
    const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    await transporter.send({
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: ['mock@mail.com'],
      cc: ['mock@mail.com', 'mock@mail.com'],
      bcc: ['mock@mail.com', 'mock@mail.com'],
      text: 'text',
      replyTo: 'mock@mail.com',
      attachments: [{ name: 'mockAttachments', path: 'mock/path' }]
    });

    expect(SendRawEmailSpy).toHaveBeenNthCalledWith(1, {
      RawMessage: { Data: 'mockMessage' }
    });
    expect(FsMock.ReadFileSyncSpy).toHaveBeenNthCalledWith(1, 'mock/path');
    expect(LookupSpy).toHaveBeenNthCalledWith(1, 'mock/path');
    expect(MailComposerMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: 'mock@mail.com',
      bcc: 'mock@mail.com,mock@mail.com',
      cc: 'mock@mail.com,mock@mail.com',
      text: 'text',
      replyTo: 'mock@mail.com',
      attachments: [
        { encoding: 'base64', filename: 'mockAttachments', content: 'mock/path', contentType: 'image/png' }
      ]
    });
  });

  it('Should handle mixed attachments structure', async () => {
    const transporter = new AwsSES({});

    await transporter.send({
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: ['mock@mail.com'],
      cc: ['mock@mail.com', 'mock@mail.com'],
      bcc: ['mock@mail.com', 'mock@mail.com'],
      text: 'text',
      replyTo: 'mock@mail.com',
      attachments: [
        { name: 'mockAttachments', path: 'mock/path' },
        { path: 'mock/path' },
        'mock2/path2',
        '/mock3/path3.txt'
      ]
    });

    expect(MailComposerMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: 'mock@mail.com',
      bcc: 'mock@mail.com,mock@mail.com',
      cc: 'mock@mail.com,mock@mail.com',
      text: 'text',
      replyTo: 'mock@mail.com',
      attachments: [
        { encoding: 'base64', filename: 'mockAttachments', content: 'mock/path', contentType: 'image/png' },
        { encoding: 'base64', filename: 'path', content: 'mock/path', contentType: 'image/png' },
        { encoding: 'base64', filename: 'path2', content: 'mock2/path2', contentType: 'image/png' },
        { encoding: 'base64', filename: 'path3.txt', content: '/mock3/path3.txt', contentType: 'image/png' }
      ]
    });
  });

  it('Should not return type if no result is returned in attachments', async () => {
    SRC.result = false;

    const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    await transporter.send({
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: ['mock@mail.com'],
      attachments: [
        { name: 'mockAttachments', path: 'mock/path' },
        { name: 'mockAttachments', path: 'mock/path2' }
      ]
    });

    expect(LookupSpy).toHaveBeenCalledTimes(2);
    expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
    expect(SendRawEmailSpy).toHaveBeenNthCalledWith(1, {
      RawMessage: { Data: 'mockMessage' }
    });
    expect(MailComposerMock.ConstructorSpy).toHaveBeenNthCalledWith(1, {
      html: '<div>Test</div>',
      subject: 'testSubject',
      from: 'me@gmail.com',
      to: 'mock@mail.com',
      attachments: [
        { encoding: 'base64', filename: 'mockAttachments', content: 'mock/path', contentType: '' },
        { encoding: 'base64', filename: 'mockAttachments', content: 'mock/path2', contentType: '' }
      ]
    });
  });

  it('Should reject with error', async () => {
    const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    MailComposerMock.BuildError = 'mockError';
    try {
      await transporter.send({
        html: '<div>Test</div>',
        subject: 'testSubject',
        from: 'me@gmail.com',
        to: ['mock@mail.com']
      });
    } catch (error) {
      expect(error).toBe('mockError');
    }
  });

  it('Should return AwsSES', () => {
    const transporter = new AwsSES({ accessKeyId: 'mockKey', secretAccessKey: 'mockKey', region: 'mockRegion' });

    expect(transporter.get()).toBeInstanceOf(SESMock);
  });
});
