import { isRecorded, record, search } from "@anirec/annict-search";

declare const annict_token: string;
declare const nltext: string;
declare const nltitle: string;
declare const nlpackage: string;
declare const setGlobal: (key: string, value: string) => void;
declare const setLocal: (key: string, value: string) => void;
declare const flash: (message: string) => void;
declare const exit: () => void;

type Title =
	| {
			title: string;
	  }
	| {
			workTitle: string;
			episodeTitle: string;
	  }
	| undefined;

const getTitle = (): Title => {
	if (nlpackage === "com.nttdocomo.android.danimeapp") {
		return {
			title: nltitle,
		};
	}
	if (nlpackage === "com.dmm.premium") {
		if (typeof nltext === "undefined") {
			return {
				title: nltitle,
			};
		}
		return {
			workTitle: nltext,
			episodeTitle: nltitle,
		};
	}
};

const main = async () => {
	const token = annict_token;

	const title = getTitle();
	if (!title) {
		throw new Error("タイトルの取得に失敗しました。");
	}

	const result =
		"title" in title
			? await search({ title: title.title }, token)
			: await search(
					{ workTitle: title.workTitle, episodeTitle: title.episodeTitle },
					token,
				);
	if (!result) {
		const titleStr =
			"title" in title
				? title.title
				: `${title.workTitle} ${title.episodeTitle}`;
		throw new Error(`エピソードが見つかりませんでした\n${titleStr}`);
	}
	const id = result.episode?.id || result.id;

	if (await isRecorded(id, 7, token)) {
		flash("記録済みです");
		return;
	}

	await record(id, token);

	flash("記録しました");
};

main()
	.then(() => {
		setGlobal("AniRecLastTitle", nltitle);
		exit();
	})
	.catch((e: Error) => {
		if (e.message.match(/^GraphQL Error \(Code: 401\)/)) {
			setLocal(
				"error",
				"Annictの認証に失敗しました。\nトークンが正しいか確認してください。",
			);
		} else {
			setLocal("error", e.message);
		}
		exit();
	});
