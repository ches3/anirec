import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SecondInput({
	value,
	setValue,
	isDisabled,
}: {
	value: number;
	setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
	isDisabled: boolean;
}) {
	return (
		<div className="flex mt-2 ml-8 items-center gap-2">
			<Input
				className="w-14 text-right"
				value={value}
				onChange={(e) => {
					const number = Number(e.target.value);
					setValue(number);
				}}
				disabled={isDisabled}
				type="number"
			/>
			<span className={isDisabled ? "opacity-50" : ""}>秒</span>
		</div>
	);
}

function RecordTimingOptionItem({
	value,
	label,
	secondsValue,
	setSecondsValue,
	isSelected,
}: {
	value: RecordTiming["type"];
	label: string;
	secondsValue?: number;
	setSecondsValue?: React.Dispatch<React.SetStateAction<number | undefined>>;
	isSelected: boolean;
}) {
	return (
		<div>
			<div className="flex">
				<RadioGroupItem value={value} id={value} />
				<Label htmlFor={value} className="pl-2 cursor-pointer">
					{label}
				</Label>
			</div>
			{secondsValue && setSecondsValue && (
				<SecondInput
					value={secondsValue}
					setValue={setSecondsValue}
					isDisabled={!isSelected}
				/>
			)}
		</div>
	);
}

export function RecordTimingOption({
	type,
	setType,
	continuedSeconds,
	setContinuedSeconds,
	delaySeconds,
	setDelaySeconds,
}: {
	type: RecordTiming["type"] | undefined;
	setType: React.Dispatch<
		React.SetStateAction<RecordTiming["type"] | undefined>
	>;
	continuedSeconds: number | undefined;
	setContinuedSeconds: React.Dispatch<React.SetStateAction<number | undefined>>;
	delaySeconds: number | undefined;
	setDelaySeconds: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
	return (
		<div className="mt-6">
			<Label className="font-bold text-base">記録タイミング</Label>
			<div className="mt-4">
				<RadioGroup
					defaultValue="continued"
					value={type}
					onValueChange={(value) => setType(value as RecordTiming["type"])}
					className="flex flex-col gap-4"
				>
					<RecordTimingOptionItem
						value="continued"
						label="n秒間再生し続けたら記録"
						secondsValue={continuedSeconds}
						setSecondsValue={setContinuedSeconds}
						isSelected={type === "continued"}
					/>
					<RecordTimingOptionItem
						value="delay"
						label="再生開始からn秒後に記録"
						secondsValue={delaySeconds}
						setSecondsValue={setDelaySeconds}
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
