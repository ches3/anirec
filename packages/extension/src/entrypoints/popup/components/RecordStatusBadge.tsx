import {
	CheckCircle2,
	Clock,
	Loader2,
	MinusCircle,
	XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { RecordStatus, SkipReason } from "@/types";
import { cn } from "@/utils/cn";

type StatusConfig = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	color?: string;
	bgColor?: string;
};

const statusConfigs: Record<RecordStatus["status"], StatusConfig> = {
	idle: {
		icon: MinusCircle,
		label: "ページ情報を取得中",
	},
	waiting: {
		icon: Clock,
		label: "待機中",
	},
	processing: {
		icon: Loader2,
		label: "記録中",
	},
	success: {
		icon: CheckCircle2,
		label: "記録完了",
	},
	error: {
		icon: XCircle,
		label: "エラー",
		color: "text-destructive",
		bgColor: "bg-red-50",
	},
	skipped: {
		icon: MinusCircle,
		label: "スキップ",
	},
};

export function RecordStatusBadge({
	status,
	className,
}: {
	status: RecordStatus;
	className?: string;
}) {
	const config = statusConfigs[status.status];
	const Icon = config.icon;

	return (
		<div
			className={cn(
				"flex items-center gap-2 p-3 min-h-16 rounded-lg border",
				className,
			)}
		>
			<div
				className={cn(
					"flex items-center justify-center w-8 h-8 rounded-full bg-muted",
					config.bgColor,
				)}
			>
				<Icon
					className={cn(
						"w-4 h-4 text-muted-foreground",
						config.color,
						status.status === "processing" && "animate-spin",
					)}
				/>
			</div>
			<div className="flex-1 min-w-0">
				<p className={cn("text-sm font-medium", config.color)}>
					{config.label}
				</p>
				{status.status === "waiting" && (
					<Progress value={status.progress * 100} className="h-2 mt-2" />
				)}
				{status.status === "error" && status.errorMessage && (
					<p className="text-xs text-destructive mt-0.5">
						{status.errorMessage}
					</p>
				)}
				{status.status === "skipped" && (
					<p className="text-xs text-muted-foreground">
						{getSkipReasonText(status.skipReason)}
					</p>
				)}
			</div>
		</div>
	);
}

function getSkipReasonText(reason: SkipReason): string {
	switch (reason) {
		case "disabled":
			return "自動記録が無効です";
		case "service_disabled":
			return "このサービスは無効に設定されています";
		case "duplicate":
			return "既に記録済みです";
		case "not_found":
			return "エピソードが見つかりませんでした";
	}
}
