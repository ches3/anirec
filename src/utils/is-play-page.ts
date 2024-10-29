export const isPlayPage = (url: string): boolean => {
	const urlObj = new URL(url);
	const hostname = urlObj.hostname;
	const pathname = urlObj.pathname;

	if (hostname === "tv.dmm.com") {
		return !!pathname.match(/\/vod\/playback\//);
	}
	if (hostname === "video.unext.jp") {
		return !!pathname.match(/\/play\//);
	}
	if (hostname === "abema.tv") {
		return !!pathname.match(/\/video\/episode\//);
	}
	if (hostname === "animestore.docomo.ne.jp") {
		return !!pathname.match(/\/animestore\/sc_d_pc/);
	}
	return false;
};
