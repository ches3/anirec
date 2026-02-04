import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	getRecordTiming,
	type RecordTiming,
	saveRecordTiming,
} from "@/utils/settings";

function SecondInput({
	value,
	onSecondsChange,
	isDisabled,
}: {
	value: number;
	onSecondsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isDisabled: boolean;
}) {
	return (
		<div className="flex mt-2 ml-8 items-center gap-2">
			<Input
				className="w-14 text-right"
				value={value}
				onChange={onSecondsChange}
				disabled={isDisabled}
				type="number"
				min={0}
			/>
			<span className={isDisabled ? "opacity-50" : ""}>秒</span>
		</div>
	);
}

function RecordTimingOptionItem({
	value,
	label,
	secondsValue,
	onSecondsChange,
	isSelected,
}: {
	value: RecordTiming["type"];
	label: string;
	secondsValue?: number;
	onSecondsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isSelected: boolean;
}) {
	return (
		<div>
			<div className="flex items-center">
				<RadioGroupItem value={value} id={value} />
				<Label
					htmlFor={value}
					className="pl-2 cursor-pointer font-normal text-base"
				>
					{label}
				</Label>
			</div>
			{secondsValue !== undefined && onSecondsChange && (
				<SecondInput
					value={secondsValue}
					onSecondsChange={onSecondsChange}
					isDisabled={!isSelected}
				/>
			)}
		</div>
	);
}

export function RecordTimingOption({ className }: { className?: string }) {
	const [type, setType] = useState<RecordTiming["type"]>();
	const [continuedSeconds, setContinuedSeconds] = useState<number>();
	const [delaySeconds, setDelaySeconds] = useState<number>();

	useEffect(() => {
		(async () => {
			const recordTiming = await getRecordTiming();
			setType(recordTiming.type);
			setContinuedSeconds(recordTiming.continuedSeconds);
			setDelaySeconds(recordTiming.delaySeconds);
		})();
	}, []);

	return (
		<div className={className}>
			<h2 className="font-bold text-lg">記録タイミング</h2>
			<div className="mt-4">
				<RadioGroup
					value={type}
					onValueChange={async (v) => {
						const value = v as RecordTiming["type"];
						setType(value as RecordTiming["type"]);
						await saveRecordTiming(value, continuedSeconds, delaySeconds);
					}}
					className="flex flex-col gap-4"
				>
					<RecordTimingOptionItem
						value="continued"
						label="n秒間再生し続けたら記録"
						secondsValue={continuedSeconds}
						onSecondsChange={async (e) => {
							const num = Number(e.target.value);
							if (Number.isNaN(num)) {
								return;
							}
							setContinuedSeconds(Number(num));
							await saveRecordTiming(type, num, delaySeconds);
						}}
						isSelected={type === "continued"}
					/>
					<RecordTimingOptionItem
						value="delay"
						label="再生開始からn秒後に記録"
						secondsValue={delaySeconds}
						onSecondsChange={async (e) => {
							const num = Number(e.target.value);
							if (Number.isNaN(num)) {
								return;
							}
							setDelaySeconds(Number(num));
							await saveRecordTiming(type, continuedSeconds, num);
						}}
						isSelected={type === "delay"}
					/>
					<RecordTimingOptionItem
						value="ended"
						label="再生終了時に記録"
						isSelected={type === "ended"}
					/>
				</RadioGroup>
			</div>
		</div>
	);
}
