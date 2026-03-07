type EpisodeMappingRule = {
  episodeTitleFrom: string[];
  episodeTitleTo: string;
};

type WorkMappingRule = {
  workTitleFrom: string[];
  workTitleTo?: string;
  episodeMappings?: EpisodeMappingRule[];
};

export const mappingRules: WorkMappingRule[] = [
  {
    workTitleFrom: [
      "〈物語〉シリーズ セカンドシーズン",
      "〈物語〉シリーズ セカンドシーズン（第1話～第5話） 猫物語(白)",
      "〈物語〉シリーズ セカンドシーズン（第7話～第10話） 傾物語",
      "〈物語〉シリーズ セカンドシーズン（第12話～第15話） 囮物語",
      "〈物語〉シリーズ セカンドシーズン（第17話～第20話） 鬼物語",
      "〈物語〉シリーズ セカンドシーズン（第21話～第26話） 恋物語",
      "〈物語〉シリーズ セカンドシーズン（第27話～第31話） 花物語",
      "〈物語〉シリーズ セカンドシーズン（第6話・第11話・第16話） 総集編",
    ],
    workTitleTo: "＜物語＞シリーズ セカンドシーズン",
    episodeMappings: [
      {
        episodeTitleFrom: [
          "猫物語(白) 第懇話『つばさタイガー其ノ壹』",
          "『つばさタイガー 其ノ壹』",
        ],
        episodeTitleTo: "猫物語(白) つばさタイガー 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "猫物語(白) 第懇話『つばさタイガー 其ノ貳』",
          "『つばさタイガー 其ノ貳』",
        ],
        episodeTitleTo: "猫物語(白) つばさタイガー 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "猫物語(白) 第懇話『つばさタイガー 其ノ參』",
          "『つばさタイガー 其ノ參』",
        ],
        episodeTitleTo: "猫物語(白) つばさタイガー 其ノ參",
      },
      {
        episodeTitleFrom: [
          "猫物語(白) 第懇話『つばさタイガー 其ノ肆』",
          "『つばさタイガー 其ノ肆』",
        ],
        episodeTitleTo: "猫物語(白) つばさタイガー 其ノ肆",
      },
      {
        episodeTitleFrom: [
          "猫物語(白) 第懇話『つばさタイガー 其ノ伍』",
          "『つばさタイガー 其ノ伍』",
        ],
        episodeTitleTo: "猫物語(白) つばさタイガー 其ノ伍",
      },
      {
        episodeTitleFrom: ["『総集編I』"],
        episodeTitleTo: "猫物語(黒) 総集篇I",
      },
      {
        episodeTitleFrom: [
          "傾物語 第閑話『まよいキョンシー 其ノ壹』",
          "『まよいキョンシー其ノ壹』",
        ],
        episodeTitleTo: "傾物語 まよいキョンシー 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "傾物語 第閑話『まよいキョンシー 其ノ貳』",
          "『まよいキョンシー其ノ貳』",
        ],
        episodeTitleTo: "傾物語 まよいキョンシー 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "傾物語 第閑話『まよいキョンシー 其ノ參』",
          "『まよいキョンシー其ノ參』",
        ],
        episodeTitleTo: "傾物語 まよいキョンシー 其ノ參",
      },
      {
        episodeTitleFrom: [
          "傾物語 第閑話『まよいキョンシー 其ノ肆』",
          "『まよいキョンシー其ノ肆』",
        ],
        episodeTitleTo: "傾物語 まよいキョンシー 其ノ肆",
      },
      {
        episodeTitleFrom: ["『総集編II』"],
        episodeTitleTo: "化物語 総集篇II",
      },
      {
        episodeTitleFrom: [
          "囮物語 第乱話『なでこメドゥーサ 其ノ壹』",
          "『なでこメドゥーサ其ノ壹』",
        ],
        episodeTitleTo: "囮物語 なでこメドゥーサ 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "囮物語 第乱話『なでこメドゥーサ 其ノ貳』",
          "『なでこメドゥーサ其ノ貳』",
        ],
        episodeTitleTo: "囮物語 なでこメドゥーサ 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "囮物語 第乱話『なでこメドゥーサ 其ノ參』",
          "『なでこメドゥーサ其ノ參』",
        ],
        episodeTitleTo: "囮物語 なでこメドゥーサ 其ノ參",
      },
      {
        episodeTitleFrom: [
          "囮物語 第乱話『なでこメドゥーサ 其ノ肆』",
          "『なでこメドゥーサ其ノ肆』",
        ],
        episodeTitleTo: "囮物語 なでこメドゥーサ 其ノ肆",
      },
      {
        episodeTitleFrom: ["『総集編III』"],
        episodeTitleTo: "化物語&偽物語 総集篇III",
      },
      {
        episodeTitleFrom: [
          "鬼物語 第忍話『しのぶタイム 其ノ壹』",
          "『しのぶタイム 其ノ壹』",
        ],
        episodeTitleTo: "鬼物語 しのぶタイム 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "鬼物語 第忍話『しのぶタイム 其ノ貳』",
          "『しのぶタイム 其ノ貳』",
        ],
        episodeTitleTo: "鬼物語 しのぶタイム 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "鬼物語 第忍話『しのぶタイム 其ノ參』",
          "『しのぶタイム 其ノ參』",
        ],
        episodeTitleTo: "鬼物語 しのぶタイム 其ノ參",
      },
      {
        episodeTitleFrom: [
          "鬼物語 第忍話『しのぶタイム 其ノ肆』",
          "『しのぶタイム 其ノ肆』",
        ],
        episodeTitleTo: "鬼物語 しのぶタイム 其ノ肆",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ壹』",
          "『ひたぎエンド 其ノ壹』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ貳』",
          "『ひたぎエンド 其ノ貳』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ參』",
          "『ひたぎエンド 其ノ參』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ參",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ肆』",
          "『ひたぎエンド 其ノ肆』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ肆",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ伍』",
          "『ひたぎエンド 其ノ伍』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ伍",
      },
      {
        episodeTitleFrom: [
          "恋物語 第恋話『ひたぎエンド 其ノ陸』",
          "『ひたぎエンド 其ノ陸』",
        ],
        episodeTitleTo: "恋物語 ひたぎエンド 其ノ陸",
      },
      {
        episodeTitleFrom: [
          "花物語 第変話『するがデビル 其ノ壹』",
          "『するがデビル 其ノ壹』",
        ],
        episodeTitleTo: "花物語 するがデビル 其ノ壹",
      },
      {
        episodeTitleFrom: [
          "花物語 第変話『するがデビル 其ノ貳』",
          "『するがデビル 其ノ貳』",
        ],
        episodeTitleTo: "花物語 するがデビル 其ノ貳",
      },
      {
        episodeTitleFrom: [
          "花物語 第変話『するがデビル 其ノ參』",
          "『するがデビル 其ノ參』",
        ],
        episodeTitleTo: "花物語 するがデビル 其ノ參",
      },
      {
        episodeTitleFrom: [
          "花物語 第変話『するがデビル 其ノ肆』",
          "『するがデビル 其ノ肆』",
        ],
        episodeTitleTo: "花物語 するがデビル 其ノ肆",
      },
      {
        episodeTitleFrom: [
          "花物語 第変話『するがデビル 其ノ伍』",
          "『するがデビル 其ノ伍』",
        ],
        episodeTitleTo: "花物語 するがデビル 其ノ伍",
      },
    ],
  },
  {
    workTitleFrom: ["劇場版CLANNAD"],
    workTitleTo: "劇場版 CLANNAD -クラナド-",
  },
  {
    workTitleFrom: [
      "俺の妹がこんなに可愛いわけがない。TV未放送第14話～最終回第16話",
      "俺の妹がこんなに可愛いわけがない。TV未放送分第14話～最終回第16話",
    ],
    workTitleTo: "俺の妹がこんなに可愛いわけがない。",
  },
  {
    workTitleFrom: ["俺の妹がこんなに可愛いわけがない TRUEROUTE"],
    workTitleTo: "俺の妹がこんなに可愛いわけがない",
    episodeMappings: [
      {
        episodeTitleFrom: ["俺の妹の人生相談がこれで終わるわけがない"],
        episodeTitleTo: "俺の妹の人生相談がこれで終わるわけがない TRUE ROUTE",
      },
    ],
  },
  {
    workTitleFrom: ["映画「小鳥遊六花・改 ～劇場版 中二病でも恋がしたい!～」"],
    workTitleTo: "小鳥遊六花・改 ～劇場版 中二病でも恋がしたい！～",
  },
  {
    workTitleFrom: ["ヲタクに恋は難しい OAD"],
    workTitleTo: "ヲタクに恋は難しい OAD「それは、いきなりおとづれた＝恋」",
  },
  {
    workTitleFrom: [
      "ヲタクに恋は難しい OAD2",
      "ヲタクに恋は難しい OAD「トモダチの距離」",
    ],
    workTitleTo: "ヲタクに恋は難しい OAD2「トモダチの距離」",
  },
  {
    workTitleFrom: [
      "ヲタクに恋は難しい OAD3",
      "ヲタクに恋は難しい OAD「社員旅行と願いごと」",
    ],
    workTitleTo: "ヲタクに恋は難しい OAD3「社員旅行と願い事」",
  },
];
