import { fromFile } from 'file-type';
import fs from 'fs';
import PromiseUtil from '@gkampitakis/promise-util';

interface AttachmentFile {
	type: string;
	filename: string;
	content: string;
}

interface LoadedFiles {
	data: Buffer;
	filename: string;
}

export interface File {
	name: string;
	path: string;
}

export default class AttachmentFactory {
	public constructor() {}

	public transformFiles(files: File[]): Promise<AttachmentFile[]> {
		return PromiseUtil.map(files, async (file: File) => {
			const result = await fromFile(file.path),
				content = fs.readFileSync(file.path).toString('base64');

			return {
				type: result?.mime,
				filename: file.name,
				content
			};
		});
	}

	public loadFiles(files: File[]): LoadedFiles[] {
		return files.map((file) => {
			return {
				data: fs.readFileSync(file.path),
				filename: file.name
			};
		});
	}
}
