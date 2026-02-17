import type {
  PageInfo,
  PageInfoUpdateMessage,
  PageStateData,
  RecordStatus,
  RecordStatusUpdateMessage,
} from "@/types";

let pageInfo: PageInfo = {
  status: "idle",
};
let recordStatus: RecordStatus = {
  status: "loading",
};
let currentStateVer = 0;

export function bumpStateVer(): number {
  currentStateVer += 1;
  return currentStateVer;
}

function isCurrentVer(ver?: number): boolean {
  return ver === undefined || ver === currentStateVer;
}

export function setPageInfo(info: PageInfo, ver?: number) {
  if (!isCurrentVer(ver)) {
    return;
  }
  pageInfo = info;
  browser.runtime
    .sendMessage<PageInfoUpdateMessage>({
      type: "PAGE_INFO_UPDATED",
      pageInfo: info,
    })
    .catch(() => {});
}

export function setRecordStatus(status: RecordStatus, ver?: number) {
  if (!isCurrentVer(ver)) {
    return;
  }
  recordStatus = status;
  browser.runtime
    .sendMessage<RecordStatusUpdateMessage>({
      type: "RECORD_STATUS_UPDATED",
      recordStatus: status,
    })
    .catch(() => {});
}

export function getPageStateResponse(): PageStateData {
  return {
    pageInfo,
    recordStatus,
  };
}
