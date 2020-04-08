export default function (params) {
	MailGunSpy(params);

	return {
		messages() {
			return {
				send(message, callback) {
					MailGunSendSpy(message);
					callback(MailGunConfig.error, message);
				}
			};
		}
	};
}

export const MailGunSpy = jest.fn();
export const MailGunSendSpy = jest.fn();
export const MailGunConfig = {
	error: null
};
