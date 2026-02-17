import { isRecorded, record, type SearchParam, search } from "@anirec/annict";

type TitleParams = {
  nltext: string | undefined;
  nltitle: string | undefined;
  nlpackage: string | undefined;
};

const getSearchParams = ({
  nltext,
  nltitle,
  nlpackage,
}: TitleParams): SearchParam | undefined => {
  if (nlpackage === "com.nttdocomo.android.danimeapp" && nltitle) {
    return {
      title: nltitle,
    };
  }
  if (nlpackage === "com.dmm.premium" && nltitle) {
    if (nltext) {
      return {
        workTitle: nltext,
        episodeTitle: nltitle,
      };
    }
    return {
      title: nltitle,
    };
  }
};

type MainParams = {
  token: string;
  titleParams: TitleParams;
};

type MainResult = {
  flash?: string;
  localVars?: Record<string, string>;
  globalVars?: Record<string, string>;
};

export const main = async ({
  token,
  titleParams,
}: MainParams): Promise<MainResult> => {
  try {
    if (!titleParams.nltitle) {
      return {
        localVars: {
          error: "タイトルの取得に失敗しました。",
        },
      };
    }
    const searchParams = getSearchParams(titleParams);
    if (!searchParams) {
      return {
        localVars: {
          error: "タイトルの取得に失敗しました。",
        },
      };
    }

    const result = await search(searchParams, token);
    if (!result) {
      const titleStr =
        "title" in searchParams
          ? searchParams.title
          : `${searchParams.workTitle} ${searchParams.episodeTitle}`;
      return {
        localVars: {
          error: `エピソードが見つかりませんでした\n${titleStr}`,
        },
      };
    }
    const id = result.episode?.id || result.id;

    if (await isRecorded(id, 7, token)) {
      return {
        flash: "記録済みです",
        globalVars: {
          AniRecLastTitle: titleParams.nltitle,
        },
      };
    }

    await record(id, token);

    return {
      flash: "記録しました",
      globalVars: {
        AniRecLastTitle: titleParams.nltitle,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.match(/^GraphQL Error \(Code: 401\)/)) {
      return {
        localVars: {
          error:
            "Annictの認証に失敗しました。\nトークンが正しいか確認してください。",
        },
      };
    }
    return {
      localVars: {
        error: `エラーが発生しました\n\n${message}`,
      },
    };
  }
};
