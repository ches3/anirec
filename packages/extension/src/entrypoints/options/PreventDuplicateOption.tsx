import { Input } from "@/components/ui/input";
import {
	getPreventDuplicateDays,
	savePreventDuplicateDays,
} from "@/utils/settings";

export function PreventDuplicateOption({ className }: { className?: string }) {
	const [value, setValue] = useState<number>(7);

	useEffect(() => {
		(async () => {
			setValue(await getPreventDuplicateDays());
		})();
	}, []);

	const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const num = Number(e.target.value);
		setValue(num);
		await savePreventDuplicateDays(num);
	};

	return (
		<div className={className}>
			<h2 className="text-lg font-bold">重複記録を防ぐ</h2>
			<div className="mt-4">
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
