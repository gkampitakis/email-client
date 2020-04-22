export default function test(params) {
	MailGunSpy(params);

	return {
		messages() {
			return {
				send(message, callback) {
					MailGunSendSpy(message);
					callback(MailGunConfig.error, message);
				}
			};
		},
		Attachment: class {
			constructor(param) {
				return param;
			}
		}
	};
}

export const MailGunSpy = jest.fn();
export const MailGunSendSpy = jest.fn();
export const MailGunConfig = {
	error: null
};
