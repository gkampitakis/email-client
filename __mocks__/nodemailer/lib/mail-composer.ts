export class MailComposer {
	public static ConstructorSpy = jest.fn();
	public static BuildError = false;

	public constructor(param) {
		MailComposer.ConstructorSpy(param);
	}

	public compile() {
		return {
			build(callback) {
				callback(MailComposer.BuildError, 'mockMessage');
			}
		};
	}
}

export default MailComposer;
