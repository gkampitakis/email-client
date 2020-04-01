import SendGrid from './SendGrid';

jest.mock('@sendgrid/mail');

describe('SendGrid', () => {

    const { SendEmailSpy, SetApiKeySpy } = jest.requireMock('@sendgrid/mail');

    beforeEach(() => {
        SendEmailSpy.mockClear();
        SetApiKeySpy.mockClear();
    });

    it('should call the send message', () => {

        const transporter = new SendGrid({ api_key: 'mockApiKey' });

        transporter.send({
            from: 'george',
            to: 'george',
            html: '<div>Test</div>'
        });

        expect(SendEmailSpy).toHaveBeenNthCalledWith(1, {
            from: 'george',
            to: 'george',
            content: [{
                type: 'text/html',
                value: '<div>Test</div>'
            }]
        });
        expect(SetApiKeySpy).toHaveBeenNthCalledWith(1, 'mockApiKey');

    });
});
