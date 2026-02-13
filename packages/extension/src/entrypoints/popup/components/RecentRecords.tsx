import type { Activities } from "@anirec/annict";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import type { LoadMoreResult } from "../hooks/useRecentRecords";
import { useRecentRecords } from "../hooks/useRecentRecords";

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

export function RecentRecords() {
	const loadState = useRecentRecords();

	if (loadState.status === "loading") {
		return <RecentRecordsLoadingBody />;
	}

	if (loadState.status === "error") {
		return <RecentRecordsErrorFallback />;
	}

	const { items, hasNext, isLoadingMore, handleLoadMore } = loadState;

	if (items.length === 0 && !hasNext) {
		return (
			<div className="flex items-center justify-center flex-1 mt-4">
				<p className="text-sm text-muted-foreground">記録がありません</p>
			</div>
		);
	}

	return (
		<ActivityList
			items={items}
			hasNext={hasNext}
			isLoading={isLoadingMore}
			onLoadMore={handleLoadMore}
		/>
	);
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
	hasNext,
	isLoading,
	onLoadMore,
}: {
	items: Activities["items"];
	hasNext: boolean;
	isLoading: boolean;
	onLoadMore: () => Promise<LoadMoreResult>;
}) {
	const handleLoadMore = async () => {
		const result = await onLoadMore();
		if (result === "error") {
			toast.error("記録の読み込みに失敗しました", {
				duration: 1500,
			});
		}
	};

	return (
		<>
			<ul className="divide-y divide-border">
				{items.map((item) => {
					const episodeLabel =
						item.__typename === "Record"
							? [item.episode.numberText, item.episode.title]
									.filter(Boolean)
									.join(" ")
							: undefined;

					const id =
						item.__typename === "Record" ? item.episode.id : item.work.id;

					return (
						<li key={`${id}-${item.createdAt}`} className="py-3.5">
							<p
								className={cn(
									"text-xs",
									!episodeLabel && "text-sm font-medium",
								)}
							>
								{item.work.title}
							</p>
							<div className="flex items-end justify-between mt-2">
								<p className="text-sm font-medium mr-2">{episodeLabel}</p>
								<p className="text-xs text-muted-foreground shrink-0">
									{formatRelativeTime(item.createdAt)}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
			{hasNext && (
				<div className="text-center">
					<button
						type="button"
						onClick={handleLoadMore}
						disabled={isLoading}
						className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
					>
						{isLoading ? "読み込み中..." : "もっと読み込む"}
					</button>
				</div>
			)}
		</>
	);
}
