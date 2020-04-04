export class Handlebars {
	public static HandlebarsCompileSpy = jest.fn();
	public static HandlebarsTemplateSpy = jest.fn();

	public static compile(file: any): any {
		Handlebars.HandlebarsCompileSpy(file);

		return Handlebars.HandlebarsTemplateSpy;
	}
}

export default Handlebars;
