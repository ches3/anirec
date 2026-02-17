type AnnictId =
	| { type: "work" | "episode" | "record" | "review"; id: string }
	| { type: "invalid" };

export function toAnnictId(encoded: string): AnnictId {
	try {
		const decoded = atob(encoded);
		const workMatch = decoded.match(/^Work-([\d]+)$/);
		if (workMatch) {
			return { type: "work", id: workMatch[1] };
		}
		const episodeMatch = decoded.match(/^Episode-([\d]+)$/);
		if (episodeMatch) {
			return { type: "episode", id: episodeMatch[1] };
		}
		const recordMatch = decoded.match(/^Record-([\d]+)$/);
		if (recordMatch) {
			return { type: "record", id: recordMatch[1] };
		}
		const reviewMatch = decoded.match(/^Review-([\d]+)$/);
		if (reviewMatch) {
			return { type: "review", id: reviewMatch[1] };
		}
		return { type: "invalid" };
	} catch (e) {
		if (e instanceof DOMException) {
			if (e.name === "InvalidCharacterError") {
				return { type: "invalid" };
			}
		}
		throw e;
	}
}

export function getAnnictUrl(workId: string, episodeId?: string): string {
	const work = toAnnictId(workId);
	if (episodeId) {
		const episode = toAnnictId(episodeId);
		if (work.type !== "work" || episode.type !== "episode") {
			throw new Error(`Invalid ids: workId=${workId}, episodeId=${episodeId}`);
		}
		return `https://annict.com/works/${work.id}/episodes/${episode.id}`;
	}
	if (work.type !== "work") {
		throw new Error(`Invalid workId: ${workId}`);
	}
	return `https://annict.com/works/${work.id}`;
}
