export class AttachmentFactory {
	public static TransformFilesSpy = jest.fn();

	public constructor() {}

	public transformFiles(files: any) {
		AttachmentFactory.TransformFilesSpy(files);
		return files;
	}
}

export default AttachmentFactory;
