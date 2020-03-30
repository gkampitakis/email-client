import { Transporter } from "../Transporter";

interface MailGunConfiguration {

}

export default class MailGun extends Transporter {

    constructor(configuration: MailGunConfiguration) {
        super(configuration);
    }

    public send(): Promise<any> {

        return Promise.resolve('Sending from MailGun');

    }

}