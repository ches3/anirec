import { type Activities, getAnnictUrl } from "@anirec/annict";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Trash2, Undo2 } from "lucide-react";
import { type ComponentProps, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

import { useDeleteRecord } from "../hooks/useDeleteRecord";
import { type RecentRecordsLoadState, useRecentRecords } from "../hooks/useRecentRecords";

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  return `${diffDays}日前`;
}

export function RecentRecords({ ref, ...props }: ComponentProps<"div">) {
  const loadState = useRecentRecords();
  const [loadError, setLoadError] = useState(false);

  const handleLoadMore = async () => {
    if (loadState.status !== "success") return;

    const result = await loadState.handleLoadMore();
    setLoadError(result === "error");
    if (result === "error") {
      toast.error("記録の読み込みに失敗しました", {
        duration: 1500,
      });
    }
  };

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading:
      loadState.status === "loading" || (loadState.status === "success" && loadState.isLoadingMore),
    hasNextPage: loadState.status === "success" && loadState.hasNext,
    onLoadMore: handleLoadMore,
    disabled: loadError || loadState.status !== "success",
    rootMargin: "0px 0px 100px 0px",
  });
  const composedRef = useComposedRefs(ref, rootRef);

  return (
    <div {...props} ref={composedRef}>
      <RecentRecordsBody loadState={loadState} />
      <div
        ref={infiniteRef}
        className={cn("text-center", loadState.status === "success" && loadState.hasNext && "py-2")}
      >
        {loadState.status === "success" &&
          loadState.hasNext &&
          (loadError ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadState.isLoadingMore}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {loadState.isLoadingMore ? "読み込み中..." : "再試行"}
            </button>
          ) : (
            <output className="text-xs text-muted-foreground">読み込み中...</output>
          ))}
      </div>
    </div>
  );
}

function RecentRecordsBody({ loadState }: { loadState: RecentRecordsLoadState }) {
  if (loadState.status === "loading") {
    return <RecentRecordsLoadingBody />;
  }

  if (loadState.status === "error") {
    return <RecentRecordsErrorFallback />;
  }

  const { items, hasNext, removeItem } = loadState;

  if (items.length === 0 && !hasNext) {
    return (
      <div className="flex items-center justify-center flex-1 mt-4">
        <p className="text-sm text-muted-foreground">記録がありません</p>
      </div>
    );
  }

  return <ActivityList items={items} removeItem={removeItem} />;
}

function RecentRecordsErrorFallback() {
  return (
    <div className="flex items-center justify-center flex-1 mt-4">
      <p className="text-sm text-destructive">記録の取得に失敗しました。</p>
    </div>
  );
}

function RecentRecordsLoadingBody() {
  return (
    <div className="space-y-3 mt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: スケルトン表示用の静的リスト
        <div key={i} className="py-2 border-b border-border">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-28 mt-1.5" />
        </div>
      ))}
    </div>
  );
}

function ActivityList({
  items,
  removeItem,
}: {
  items: Activities["items"];
  removeItem: (id: string) => void;
}) {
  const { scheduleDelete, cancelDelete, pendingDeletions } = useDeleteRecord(removeItem);

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const episodeLabel =
          item.__typename === "Record"
            ? [item.episode.numberText, item.episode.title].filter(Boolean).join(" ")
            : undefined;

        const pending = pendingDeletions.has(item.id);

        return (
          <li key={item.id} className="py-3.5">
            <div className="flex justify-between gap-2">
              <div
                className={cn(
                  "flex-1 min-w-0 flex flex-col gap-2 transition-opacity",
                  pending && "opacity-30",
                )}
              >
                <a
                  href={getAnnictUrl(item.work.id)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "w-fit text-xs hover:underline",
                    !episodeLabel && "text-sm font-medium",
                  )}
                >
                  {item.work.title}
                </a>
                {item.__typename === "Record" && (
                  <a
                    href={getAnnictUrl(item.work.id, item.episode.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit text-sm font-medium hover:underline"
                  >
                    {episodeLabel}
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end justify-end shrink-0 gap-2">
                {pending ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground"
                    onClick={() => cancelDelete(item.id)}
                    aria-label="元に戻す"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-destructive"
                    onClick={() => scheduleDelete(item.id)}
                    aria-label="削除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <p
                  className={cn(
                    "text-xs text-muted-foreground transition-opacity",
                    pending && "opacity-30",
                  )}
                >
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
