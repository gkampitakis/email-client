import { Transporter } from '../Transporter';

export default class MailGun extends Transporter {
    constructor(configuration) {
        super(configuration);
    }

    public send(message: any): Promise<any> {
        return Promise.resolve('Sending from MailGun');
    }
}
