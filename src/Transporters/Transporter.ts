import path from 'path';
import fs from 'fs';
import { fromFile } from 'file-type';

/**
 * Attachment File
 */
export interface AttFile {
	/** You can specify different name for the file */
	name?: string;
	/** Path were file is located */
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

	protected async getFileData(file: any): Promise<{ content: Buffer; filename: string; contentType: any }> {
		let filepath = file.path;
		let filename = file.name;

		if (!file.path) filepath = file;
		if (!file.name) {
			const parsePath = path.parse(filepath);
			filename = parsePath.name + parsePath.ext;
		}

		const result = await fromFile(filepath);

		return {
			filename,
			content: fs.readFileSync(filepath),
			contentType: result?.mime
		};
	}
}
