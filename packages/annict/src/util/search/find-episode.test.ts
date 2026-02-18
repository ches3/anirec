import {
  findEpisodeByBracketTitle,
  findEpisodeByNumber,
  findEpisodeByNumberText,
  findEpisodeByTitle,
  findEpisodeByTitleAndNumberText,
} from "./find-episode";

const episodes = [
  {
    id: "RXBpc29kZS0xODM1Mg==",
    title: "ようこそハイスクール",
    number: 1,
    numberText: "第一回",
  },
  {
    id: "RXBpc29kZS0xODQ1Mw==",
    title: "よろしくユーフォニアム",
    number: 2,
    numberText: "第二回",
  },
  {
    id: "RXBpc29kZS0xODU3OQ==",
    title: "はじめてアンサンブル",
    number: 3,
    numberText: "第三回",
  },
  {
    id: "RXBpc29kZS0xODY4Mg==",
    title: "うたうよソルフェージュ",
    number: 4,
    numberText: "第四回",
  },
  {
    id: "RXBpc29kZS0xOTE2Ng==",
    title: "ただいまフェスティバル",
    number: 5,
    numberText: "第五回",
  },
  {
    id: "RXBpc29kZS0xOTM1MQ==",
    title: "きらきらチューバ",
    number: 6,
    numberText: "第六回",
  },
  {
    id: "RXBpc29kZS0xOTQ0MQ==",
    title: "なきむしサクソフォン",
    number: 7,
    numberText: "第七回",
  },
  {
    id: "RXBpc29kZS0xOTU1Mw==",
    title: "おまつりトライアングル",
    number: 8,
    numberText: "第八回",
  },
  {
    id: "RXBpc29kZS0xOTc1Nw==",
    title: "おねがいオーディション",
    number: 9,
    numberText: "第九回",
  },
  {
    id: "RXBpc29kZS0xOTg5Ng==",
    title: "まっすぐトランペット",
    number: 10,
    numberText: "第十回",
  },
  {
    id: "RXBpc29kZS0yMDAxNw==",
    title: "おかえりオーディション",
    number: 11,
    numberText: "第十一回",
  },
  {
    id: "RXBpc29kZS0yMDMxOQ==",
    title: "わたしのユーフォニアム",
    number: 12,
    numberText: "第十二回",
  },
  {
    id: "RXBpc29kZS0yMDM5MA==",
    title: "さよならコンクール",
    number: 13,
    numberText: "第十三回",
  },
  {
    id: "RXBpc29kZS0zMjMwNA==",
    title: "かけだすモナカ",
    number: undefined,
    numberText: "番外編",
  },
];

describe("findEpisodeByTitle", () => {
  test("titleで検索", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: "第一回",
      number: 1,
    };
    const episode = findEpisodeByTitle(episodes, target);
    expect(episode).toEqual({
      id: "RXBpc29kZS0xODM1Mg==",
      title: "ようこそハイスクール",
      number: 1,
      numberText: "第一回",
    });
  });

  test("titleがundefinedの場合はundefinedを返す", () => {
    const target = {
      title: undefined,
      numberText: "第一回",
      number: 1,
    };
    const episode = findEpisodeByTitle(episodes, target);
    expect(episode?.id).toEqual(undefined);
  });

  test("strictでは一致しないがweakで1件一致する場合に返す", () => {
    // ！があるのでstrictでは不一致、weakで記号を除去して一致
    const target = {
      title: "ようこそ！ハイスクール",
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByTitle(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("weakで複数一致する場合はundefinedを返す", () => {
    const ambiguous = [
      {
        id: "ep1",
        title: "ようこそ！ハイスクール",
        number: 1,
        numberText: "第一回",
      },
      {
        id: "ep2",
        title: "ようこそ☆ハイスクール",
        number: 2,
        numberText: "第二回",
      },
    ];
    // weakモードでは両方が「ようこそハイスクール」に正規化されて一致
    const target = {
      title: "ようこそハイスクール",
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByTitle(ambiguous, target);
    expect(episode?.id).toEqual(undefined);
  });
});

describe("findEpisodeByNumberText", () => {
  test("numberTextで検索", () => {
    const target = {
      title: undefined,
      numberText: "第一回",
      number: 1,
    };
    const episode = findEpisodeByNumberText(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("numberTextがundefinedの場合はundefinedを返す", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: undefined,
      number: 1,
    };
    const episode = findEpisodeByNumberText(episodes, target);
    expect(episode?.id).toEqual(undefined);
  });

  test("strictでは一致しないがweakで1件一致する場合に返す", () => {
    // !があるのでstrictでは不一致、weakで記号を除去して一致
    const target = {
      title: undefined,
      numberText: "第一回!",
      number: undefined,
    };
    const episode = findEpisodeByNumberText(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("weakで複数一致する場合はundefinedを返す", () => {
    const ambiguous = [
      { id: "ep1", title: "タイトル1", number: 1, numberText: "第1回!" },
      { id: "ep2", title: "タイトル2", number: 2, numberText: "第1回?" },
    ];
    // weakモードでは両方が「第1回」に正規化されて一致
    const target = { title: undefined, numberText: "第1回", number: undefined };
    const episode = findEpisodeByNumberText(ambiguous, target);
    expect(episode?.id).toEqual(undefined);
  });
});

describe("findEpisodeByNumber", () => {
  test("numberで検索", () => {
    const target = {
      title: undefined,
      numberText: undefined,
      number: 1,
    };
    const episode = findEpisodeByNumber(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("target.numberがundefinedの場合はundefinedを返す", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: "第一回",
      number: undefined,
    };
    const episode = findEpisodeByNumber(episodes, target);
    expect(episode?.id).toEqual(undefined);
  });

  test("episode.numberがundefinedのみの場合はundefinedを返す", () => {
    const target = {
      title: undefined,
      numberText: "番外編",
      number: 99,
    };
    const episode = findEpisodeByNumber(
      [
        {
          id: "RXBpc29kZS0zMjMwNA==",
          title: "かけだすモナカ",
          number: undefined,
          numberText: "番外編",
        },
      ],
      target,
    );
    expect(episode?.id).toEqual(undefined);
  });
});

describe("findEpisodeByBracketTitle", () => {
  test("「」内のタイトルで検索", () => {
    const target = {
      title: "前置きテキスト 「ようこそハイスクール」",
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByBracketTitle(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("タイトル全体が「」で囲まれている場合", () => {
    const target = {
      title: "「ようこそハイスクール」",
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByBracketTitle(episodes, target);
    expect(episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
  });

  test("「」がない場合はundefinedを返す", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByBracketTitle(episodes, target);
    expect(episode).toEqual(undefined);
  });

  test("titleがundefinedの場合はundefinedを返す", () => {
    const target = {
      title: undefined,
      numberText: undefined,
      number: undefined,
    };
    const episode = findEpisodeByBracketTitle(episodes, target);
    expect(episode).toEqual(undefined);
  });
});

describe("findEpisodeByTitleAndNumberText", () => {
  test("titleとnumberTextが両方一致する場合に返す", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: "第一回",
      number: 1,
    };
    const episode = findEpisodeByTitleAndNumberText(episodes, target);
    expect(episode).toEqual({
      id: "RXBpc29kZS0xODM1Mg==",
      title: "ようこそハイスクール",
      number: 1,
      numberText: "第一回",
    });
  });

  test("titleのみ一致してもundefinedを返す", () => {
    const target = {
      title: "ようこそハイスクール",
      numberText: undefined,
      number: 1,
    };
    const episode = findEpisodeByTitleAndNumberText(episodes, target);
    expect(episode?.id).toEqual(undefined);
  });

  test("numberTextのみ一致してもundefinedを返す", () => {
    const target = {
      title: undefined,
      numberText: "第一回",
      number: 1,
    };
    expect(findEpisodeByTitleAndNumberText(episodes, target)?.id).toEqual(
      undefined,
    );
  });

  test("strictでは一致しないがweakで1件一致する場合に返す", () => {
    // titleに！、numberTextに!があるのでstrictでは不一致、weakで記号を除去して一致
    const target = {
      title: "ようこそ！ハイスクール",
      numberText: "第一回!",
      number: undefined,
    };
    expect(findEpisodeByTitleAndNumberText(episodes, target)?.id).toEqual(
      "RXBpc29kZS0xODM1Mg==",
    );
  });

  test("weakで複数一致する場合はundefinedを返す", () => {
    const ambiguous = [
      {
        id: "ep1",
        title: "ようこそ！ハイスクール",
        number: 1,
        numberText: "第1回!",
      },
      {
        id: "ep2",
        title: "ようこそ☆ハイスクール",
        number: 2,
        numberText: "第1回?",
      },
    ];
    // weakモードでは両方のtitle・numberTextが同じ文字列に正規化されて一致
    const target = {
      title: "ようこそハイスクール",
      numberText: "第1回",
      number: undefined,
    };
    expect(findEpisodeByTitleAndNumberText(ambiguous, target)?.id).toEqual(
      undefined,
    );
  });
});
