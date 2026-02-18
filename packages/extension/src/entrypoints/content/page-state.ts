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

function isCurrentVer(ver: number): boolean {
  return ver === currentStateVer;
}

export function setPageInfo(info: PageInfo, ver: number) {
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

export function setRecordStatus(status: RecordStatus, ver: number) {
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

export type PageStateUpdater = {
  setPageInfo: (info: PageInfo) => void;
  setRecordStatus: (status: RecordStatus) => void;
};

export function createStateUpdater(ver: number): PageStateUpdater {
  return {
    setPageInfo: (info) => setPageInfo(info, ver),
    setRecordStatus: (status) => setRecordStatus(status, ver),
  };
}

export function getPageStateResponse(): PageStateData {
  return {
    pageInfo,
    recordStatus,
  };
}
