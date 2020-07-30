export interface File {
	name: string;
	path: string;
}

export abstract class Transporter {
	protected configuration: any;

	constructor(configuration: any) {
		this.configuration = configuration;
	}

	public abstract send(message: any): Promise<any>;

	public abstract get(): any;

	protected abstract messageTransform(message: any): Record<string, any>;

	protected abstract processAttachments(files: any): Record<string, any>;
}
