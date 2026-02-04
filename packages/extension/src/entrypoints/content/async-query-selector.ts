export const asyncQuerySelector = (selector: string) => {
	return new Promise<Element | undefined>((resolve) => {
		const interval = setInterval(() => {
			const element = document.querySelector(selector);
			if (element) {
				clearInterval(interval);
				return resolve(element);
			}
		}, 500);
		setTimeout(() => {
			clearInterval(interval);
			return resolve(undefined);
		}, 30000);
	});
};
