const LookupSpy = jest.fn(),
	SRC = { result: true };

export default {
	lookup(...args) {
		LookupSpy(...args);
		return SRC.result ? 'image/png' : false;
	}
};

export { LookupSpy, SRC };
