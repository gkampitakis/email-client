import AttachmentFactory from './AttachmentFactory';

jest.mock('fs');
jest.mock('file-type');

describe('Attachment Factory', () => {
	const { FromFileSpy, SRC } = jest.requireMock('file-type'),
		FsMock = jest.requireMock('fs').Fs;

	beforeEach(() => {
		FromFileSpy.mockClear();
		FsMock.ReadFileSyncSpy.mockClear();
		SRC.result = true;
	});

	it('Construct the correct object', async () => {
		const factory = new AttachmentFactory();

		const res = await factory.transformFiles([
			{ name: 'test.png', path: 'a/random/path' },
			{ name: 'test2.png', path: 'a/random/path2' }
		]);

		expect(FromFileSpy).toHaveBeenCalledTimes(2);
		expect(FromFileSpy).toHaveBeenCalledWith('a/random/path');
		expect(FromFileSpy).toHaveBeenCalledWith('a/random/path2');
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledTimes(2);
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledWith('a/random/path');
		expect(FsMock.ReadFileSyncSpy).toHaveBeenCalledWith('a/random/path2');

		expect(res).toEqual([
			{ type: 'image/png', filename: 'test.png', content: 'a/random/path' },
			{ type: 'image/png', filename: 'test2.png', content: 'a/random/path2' }
		]);
	});

	it('Should return undefined type', async () => {
		const factory = new AttachmentFactory();

		SRC.result = false;

		const res = await factory.transformFiles([{ name: 'test.png', path: 'a/random/path' }]);

		expect(res).toEqual([{ type: undefined, filename: 'test.png', content: 'a/random/path' }]);
	});

	it('Should return an empty array', async () => {
		const factory = new AttachmentFactory();

		const res = await factory.transformFiles([]);

		expect(res.length).toBe(0);
	});
});
