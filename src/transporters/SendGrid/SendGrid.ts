import { Transporter } from '../Transporter';
import { send, setApiKey } from '@sendgrid/mail';

export default class SendGrid extends Transporter {
    constructor(configuration: any) {
        setApiKey(configuration.api_key);
        super(configuration);
    }

    public send(message: any): Promise<any> { //TODO: add evaluation here for checking message
        //and correct emails are provided 
        //add support for compiling the html
        //Check the required fields

        let { html, ...data } = message;
        data.content = [{
            type: 'text/html',
            value: html
        }];

        return send(data);

    }

    private validateMessage(message: any) {

        //https://sendgrid.com/docs/API_Reference/api_v3.html // TODO: implement this logic here

    }


}


