export default function (data: any) {
	MjmlCompileSpy(data);
	return {
		html: 'html'
	};
}

export const MjmlCompileSpy = jest.fn();
