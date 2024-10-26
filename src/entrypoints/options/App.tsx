import { Button } from "@/components/ui/button";
import {
	type RecordTiming,
	getRecordTiming,
	saveRecordTiming,
} from "@/utils/settings";
import { RecordTimingOption } from "./RecordTimingOption";
import { TokenOption } from "./TokenOption";

function App() {
	const [recordTimingType, setRecordTimingType] =
		useState<RecordTiming["type"]>();
	const [continuedSeconds, setContinuedSeconds] = useState<number>();
	const [delaySeconds, setDelaySeconds] = useState<number>();

	const [saved, setSaved] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const recordTiming = await getRecordTiming();
			setRecordTimingType(recordTiming.type);
			setContinuedSeconds(recordTiming.continuedSeconds);
			setDelaySeconds(recordTiming.delaySeconds);
		})();
	}, []);

	const handleSave = async () => {
		await saveRecordTiming(recordTimingType, continuedSeconds, delaySeconds);

		setSaved(true);
		setTimeout(() => {
			setSaved(false);
		}, 1000);
	};

	return (
		<div className="mx-6 mt-2 mb-8 text-base">
			<TokenOption />
			<RecordTimingOption
				type={recordTimingType}
				setType={setRecordTimingType}
				continuedSeconds={continuedSeconds}
				setContinuedSeconds={setContinuedSeconds}
				delaySeconds={delaySeconds}
				setDelaySeconds={setDelaySeconds}
			/>
			<Button onClick={handleSave} className="mt-6 w-20">
				{saved ? "Saved!" : "Save"}
			</Button>
		</div>
	);
}

export default App;
