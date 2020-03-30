export abstract class Transporter {

    protected configuration: any;

    constructor(configuration: any) {
        this.configuration = configuration;
    }

    public send() { }

}