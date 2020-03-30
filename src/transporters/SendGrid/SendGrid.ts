import { Transporter } from "../Transporter";

interface SendGridConfiguration {

}

export default class SendGrid extends Transporter {

    constructor(configuration: SendGridConfiguration) {
        super(configuration);
    }

    public send(): Promise<any> {

        return Promise.resolve('Sending from SendGrid');

    }

}