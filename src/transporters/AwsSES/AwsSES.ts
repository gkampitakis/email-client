import { Transporter } from '../Transporter';

export default class AwsSES extends Transporter {
	constructor(configuration: any) {
		super(configuration);
		this.setupAwsSES(configuration);
	}

	public send(message: any): Promise<any> {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	public get(): any {
		return;
	}

	private setupAwsSES(config: any) {
		return;
	}

	protected messageTransform(message: any): {} {
		return {};
	}
}
