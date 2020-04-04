export class Handlebars {
	public static HandlebarsCompileSpy = jest.fn();
	public static HandlebarsTemplateSpy = jest.fn();
	public static RegisterHelperSpy = jest.fn();

	public static compile(file: any): any {
		Handlebars.HandlebarsCompileSpy(file);

		return Handlebars.HandlebarsTemplateSpy;
	}

	public static registerHelper(name: string, helperFunc: any): void {
		Handlebars.RegisterHelperSpy(name, helperFunc);
		return;
	}
}

export default Handlebars;
