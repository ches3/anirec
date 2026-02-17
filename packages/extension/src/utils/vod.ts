import type { Vod } from "@/types";
import type { ServiceEnabled } from "@/utils/settings";

export const identifyVod = (url: string | URL): Vod | undefined => {
	const urlObj = typeof url === "string" ? new URL(url) : url;

	const hostname = urlObj.hostname;
	const pathname = urlObj.pathname;

	if (hostname === "tv.dmm.com" && /\/vod\/playback\//.test(pathname)) {
		return "dmm";
	}
	if (hostname === "video.unext.jp" && /\/play\//.test(pathname)) {
		return "unext";
	}
	if (hostname === "abema.tv" && /\/video\/episode\//.test(pathname)) {
		return "abema";
	}
	if (
		hostname === "animestore.docomo.ne.jp" &&
		/\/animestore\/sc_d_pc/.test(pathname)
	) {
		return "danime";
	}
	return;
};

export const isVodEnabled = (vod: Vod, enabled: ServiceEnabled): boolean => {
	return enabled[vod];
};
