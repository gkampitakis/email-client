export default class Ejs {
	static CompileSpy = jest.fn();
	static TemplateSpy = jest.fn();

	static compile(file) {
		Ejs.CompileSpy(file);

		return (param) => {
			Ejs.TemplateSpy(param);
			return 'htmlEJS';
		};
	}
}
