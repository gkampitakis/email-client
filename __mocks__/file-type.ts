const FromFileSpy = jest.fn(),
	SRC = { result: true };

function fromFile(path: string) {
	FromFileSpy(path);
	return Promise.resolve(SRC.result ? { mime: 'image/png' } : undefined);
}

export { fromFile, FromFileSpy, SRC };
