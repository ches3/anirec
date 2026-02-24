import { Check, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useManualRecord } from "../hooks/useManualRecord";
import { useManualSkip } from "../hooks/useManualSkip";
import { usePageState } from "../hooks/usePageState";
import { useRetry } from "../hooks/useRetry";
import { RecordStatusBadge } from "./RecordStatusBadge";

export function PageState() {
  const { error, pageInfo, recordStatus, vod, tabId } = usePageState();
  const { manualRecord, isRecording } = useManualRecord(tabId);
  const { manualSkip } = useManualSkip(tabId);
  const { retry } = useRetry(tabId);

  if (error) {
    return (
      <div className="flex justify-center flex-1">
        <div className="text-center space-y-3">
          <Info className="w-12 h-12 mx-auto text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (pageInfo.status !== "loading" && !vod) {
    return (
      <div className="mt-8 flex justify-center flex-1">
        <div className="text-center space-y-3">
          <Info className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            対応している再生ページではありません
          </p>
          <p className="text-xs text-muted-foreground">
            DMM TV、U-NEXT、ABEMA、dアニメストアの
            <br />
            再生ページでご利用ください
          </p>
        </div>
      </div>
    );
  }

  const annictInfo = pageInfo.status === "ready" ? pageInfo.annictInfo : null;
  const annictId = annictInfo?.episode?.id ?? annictInfo?.id;
  const canManualRecord =
    annictId !== undefined &&
    recordStatus.status !== "processing" &&
    recordStatus.status !== "success" &&
    recordStatus.status !== "error" &&
    !isRecording;
  const canManualSkip = recordStatus.status === "waiting" && !isRecording;

  const episodeTitle = [
    annictInfo?.episode?.numberText || annictInfo?.episode?.number,
    annictInfo?.episode?.title,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-3 mt-2">
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">作品タイトル</Label>
        {pageInfo.status === "loading" ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <p className="text-sm font-medium">{annictInfo?.title || "-"}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">エピソード</Label>
        {pageInfo.status === "loading" ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <p className="text-sm font-medium">{episodeTitle || "-"}</p>
        )}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-2">記録状態</Label>
        <RecordStatusBadge
          status={recordStatus}
          onRetry={recordStatus.status === "error" ? retry : undefined}
          className="mt-1"
        />
      </div>

      {annictId && (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="w-full text-xs"
            disabled={!canManualRecord}
            onClick={() => manualRecord(annictId)}
          >
            {isRecording ? (
              <>
                <Loader2 className="animate-spin size-5 mr-1.5" />
                記録中...
              </>
            ) : recordStatus.status === "success" ? (
              <>
                <Check className="size-5 mr-1.5" />
                記録済み
              </>
            ) : (
              "今すぐ記録"
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            disabled={!canManualSkip}
            onClick={() => {
              if (!canManualSkip) return;
              void manualSkip();
            }}
          >
            記録をスキップ
          </Button>
        </div>
      )}
    </div>
  );
}
