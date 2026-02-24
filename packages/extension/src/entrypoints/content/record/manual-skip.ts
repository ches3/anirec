import { getCurrentStateVer, setRecordStatus } from "../page-state";

export function handleManualSkip(): void {
  const ver = getCurrentStateVer();
  setRecordStatus({ status: "skipped", skipReason: "manual_skip" }, ver);
}
