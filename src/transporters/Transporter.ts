export abstract class Transporter {
	protected configuration: any;

	constructor(configuration: any) {
		this.configuration = configuration;
	}

	public abstract send(message: any): Promise<any>;

	public abstract get(): any;
}
