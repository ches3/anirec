import type { SearchParam, SearchResult } from "@anirec/annict";

export type Vod = "dmm" | "unext" | "abema" | "danime";

export type WorkInfoData = {
	vod: Vod;
	searchParams: SearchParam[];
};

export type SkipReason =
	| "service_disabled" // サービスが無効化されている
	| "duplicate" // 既に記録済み
	| "not_found"; // エピソードが見つからない

// 録画状態の情報
export type RecordStatus =
	| {
			status: "idle" | "waiting" | "processing" | "success";
	  }
	| {
			status: "error";
			errorMessage: string;
	  }
	| {
			status: "skipped";
			skipReason: SkipReason;
	  };

export type PageStateMessage = {
	type: "GET_PAGE_STATE";
};

export type PageInfo =
	| {
			status: "idle" | "loading";
	  }
	| {
			status: "ready";
			workInfo: WorkInfoData;
			annictInfo: SearchResult;
	  };

export type PageStateData = {
	pageInfo: PageInfo;
	recordStatus: RecordStatus;
};

export type RecordStatusUpdateMessage = {
	type: "RECORD_STATUS_UPDATED";
	recordStatus: RecordStatus;
};

export type PageInfoUpdateMessage = {
	type: "PAGE_INFO_UPDATED";
	pageInfo: PageInfo;
};
