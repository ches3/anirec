import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RecordTiming } from "@/utils/settings";

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
    <div className="flex mt-2 ml-4 items-center gap-2">
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
        <Label htmlFor={value} className="pl-2 cursor-pointer">
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

export function RecordTimingOption({
  className,
  timing,
  onChange,
}: {
  className?: string;
  timing: RecordTiming;
  onChange: (patch: Partial<RecordTiming>) => void;
}) {
  const { type, continuedSeconds } = timing;

  return (
    <div className={className}>
      <h2 className="font-bold text-base">記録タイミング</h2>
      <div className="mt-4">
        <RadioGroup
          value={type}
          onValueChange={(v) => {
            const value = v as RecordTiming["type"];
            onChange({ type: value });
          }}
          className="flex flex-col gap-4"
        >
          <RecordTimingOptionItem
            value="continued"
            label="一定時間再生後"
            secondsValue={continuedSeconds}
            onSecondsChange={(e) => {
              const num = Number(e.target.value);
              if (Number.isNaN(num)) {
                return;
              }
              onChange({ continuedSeconds: num });
            }}
            isSelected={type === "continued"}
          />
          <RecordTimingOptionItem
            value="ended"
            label="再生終了時"
            isSelected={type === "ended"}
          />
        </RadioGroup>
      </div>
    </div>
  );
}
