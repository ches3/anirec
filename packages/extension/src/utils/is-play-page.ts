import { getEnabledServices } from "./settings";

export const isPlayPage = async (url: string): Promise<boolean> => {
	const urlObj = new URL(url);
	const hostname = urlObj.hostname;
	const pathname = urlObj.pathname;

	const enabled = await getEnabledServices();

	if (hostname === "tv.dmm.com" && enabled.dmm) {
		return !!pathname.match(/\/vod\/playback\//);
	}
	if (hostname === "video.unext.jp" && enabled.unext) {
		return !!pathname.match(/\/play\//);
	}
	if (hostname === "abema.tv" && enabled.abema) {
		return !!pathname.match(/\/video\/episode\//);
	}
	if (hostname === "animestore.docomo.ne.jp" && enabled.danime) {
		return !!pathname.match(/\/animestore\/sc_d_pc/);
	}
	return false;
};
