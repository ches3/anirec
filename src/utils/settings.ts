export async function getToken() {
	const token =
		(await storage.getItem<string>("sync:token")) ||
		import.meta.env.WXT_ANNICT_TOKEN;
	return token;
}

export async function saveToken(token: string) {
	await storage.setItem<string>("sync:token", token);
}
