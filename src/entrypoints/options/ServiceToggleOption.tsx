import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	type ServiceEnabled,
	getEnabledServices,
	saveEnabledServices,
} from "@/utils/settings";

function ServiceToggleOptionItem({
	id,
	label,
	enabled,
	onToggle,
}: {
	id: keyof ServiceEnabled;
	label: string;
	enabled: boolean;
	onToggle: (service: keyof ServiceEnabled, isEnabled: boolean) => void;
}) {
	return (
		<div className="flex items-center">
			<Switch
				id={id}
				checked={enabled}
				onCheckedChange={(value) => onToggle(id, value)}
			/>
			<Label htmlFor={id} className="pl-4 cursor-pointer">
				{label}
			</Label>
		</div>
	);
}

export function ServiceToggleOption({ className }: { className?: string }) {
	const [enabled, setEnabled] = useState<ServiceEnabled>();

	useEffect(() => {
		(async () => {
			const enabled = await getEnabledServices();
			setEnabled(enabled);
		})();
	}, []);

	const onToggle = async (id: keyof ServiceEnabled, isEnabled: boolean) => {
		if (!enabled) {
			return;
		}
		const newEnabled = { ...enabled, [id]: isEnabled };
		setEnabled(newEnabled);
		await saveEnabledServices(newEnabled);
	};

	return (
		enabled && (
			<div className={className}>
				<h2 className="text-lg font-bold">自動記録を有効にするサービス</h2>
				<div className="flex flex-col gap-4 mt-4">
					<ServiceToggleOptionItem
						id="dmm"
						label="DMM TV"
						enabled={enabled.dmm}
						onToggle={onToggle}
					/>
					<ServiceToggleOptionItem
						id="unext"
						label="U-NEXT"
						enabled={enabled.unext}
						onToggle={onToggle}
					/>
					<ServiceToggleOptionItem
						id="abema"
						label="ABEMA"
						enabled={enabled.abema}
						onToggle={onToggle}
					/>
					<ServiceToggleOptionItem
						id="danime"
						label="dアニメストア"
						enabled={enabled.danime}
						onToggle={onToggle}
					/>
				</div>
			</div>
		)
	);
}
