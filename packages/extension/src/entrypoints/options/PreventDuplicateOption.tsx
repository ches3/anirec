import { Input } from "@/components/ui/input";

export function PreventDuplicateOption({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: number;
  onChange: (days: number) => void;
}) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onChange(num);
  };

  return (
    <div className={className}>
      <h2 className="font-bold text-base">重複記録を防ぐ</h2>
      <div className="mt-4 text-sm">
        n日以内に記録済みの場合は記録しない (0で常に記録)
      </div>
      <div className="flex mt-2 items-center gap-2">
        <Input
          className="w-14 text-right"
          value={value}
          onChange={handleOnChange}
          type="number"
          min={0}
        />
        <span>日</span>
      </div>
    </div>
  );
}
