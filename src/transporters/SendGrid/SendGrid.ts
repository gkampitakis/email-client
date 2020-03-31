import { Transporter } from '../Transporter';
import sendGrid from '@sendgrid/mail';

export default class SendGrid extends Transporter {
    constructor(configuration: any) {
        sendGrid.setApiKey(configuration.api_key);
        super(configuration);
    }

    public send(message: any): Promise<any> { //TODO: add evaluation here for checking message
        //and correct emails are provided 
        //add support for compiling the html
        //Check the required fields

        let { html, ...data } = message;
        data.content = [{
            type: 'test/html',
            value: html
        }];

        return sendGrid
            .send(message);

    }

    private validateMessage(message: any) {

        //https://sendgrid.com/docs/API_Reference/api_v3.html // TODO: implement this logic here

    }


}


