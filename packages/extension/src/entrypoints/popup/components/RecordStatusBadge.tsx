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
	color: string;
	bgColor: string;
};

const statusConfigs: Record<RecordStatus["status"], StatusConfig> = {
	idle: {
		icon: MinusCircle,
		label: "未実行",
		color: "text-muted-foreground",
		bgColor: "bg-muted",
	},
	waiting: {
		icon: Clock,
		label: "待機中",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	processing: {
		icon: Loader2,
		label: "処理中",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	success: {
		icon: CheckCircle2,
		label: "記録完了",
		color: "text-green-600",
		bgColor: "bg-green-50",
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
		color: "text-amber-600",
		bgColor: "bg-amber-50",
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
			className={cn("flex items-center gap-2 p-3 rounded-lg border", className)}
		>
			<div
				className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bgColor}`}
			>
				<Icon
					className={`w-4 h-4 ${config.color} ${
						status.status === "processing" ? "animate-spin" : ""
					}`}
				/>
			</div>
			<div className="flex-1 min-w-0">
				<p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
				{status.status === "waiting" && (
					<>
						<p className="text-xs text-muted-foreground">
							録画タイミングを待っています
						</p>
						<Progress value={status.progress * 100} className="h-2 mt-2" />
					</>
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
		case "service_disabled":
			return "このサービスは無効化されています";
		case "duplicate":
			return "既に記録済みです";
		case "not_found":
			return "エピソードが見つかりませんでした";
	}
}
