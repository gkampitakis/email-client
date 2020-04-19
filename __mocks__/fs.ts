export class Fs {
	public static ReaddirSyncSpy = jest.fn();
	public static ReadFileSyncSpy = jest.fn();
	public static StaticFiles = [];

	public static readdirSync(path: string): string[] {
		Fs.ReaddirSyncSpy(path);

		return Fs.StaticFiles;
	}

	public static readFileSync(file: string): any {
		Fs.ReadFileSyncSpy(file);
		return file;
	}
}

export default Fs;
