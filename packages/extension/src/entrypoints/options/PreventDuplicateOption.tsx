import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PreventDuplicate } from "@/utils/settings";

export function PreventDuplicateOption({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: PreventDuplicate;
  onChange: (next: PreventDuplicate) => void;
}) {
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, days: Number(e.target.value) });
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <Switch
          id="prevent-duplicate"
          checked={value.enabled}
          onCheckedChange={(enabled) => onChange({ ...value, enabled })}
        />
        <Label htmlFor="prevent-duplicate" className="pl-3 cursor-pointer">
          記録済みの場合はスキップ
        </Label>
      </div>
      <div className="flex mt-4 ml-4 items-center gap-2">
        <Input
          className="w-14 text-right"
          value={value.days}
          onChange={handleDaysChange}
          type="number"
          min={1}
          disabled={!value.enabled}
        />
        <span className={value.enabled ? "" : "text-neutral-400"}>
          日以内に記録済みの場合
        </span>
      </div>
    </div>
  );
}
