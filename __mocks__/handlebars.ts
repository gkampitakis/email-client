export class Hbs {
	public static CompileSpy = jest.fn();
	public static TemplateSpy = jest.fn();
	public static RegisterHelperSpy = jest.fn();

	public static compile(file: any): any {
		Hbs.CompileSpy(file);

		return Hbs.TemplateSpy;
	}

	public static registerHelper(name: string, helperFunc: any): void {
		Hbs.RegisterHelperSpy(name, helperFunc);
		return;
	}
}

export default Hbs;
