import { PreventDuplicateOption } from "./PreventDuplicateOption";
import { RecordTimingOption } from "./RecordTimingOption";
import { ServiceToggleOption } from "./ServiceToggleOption";
import { TokenOption } from "./TokenOption";

function App() {
	return (
		<div className="mx-12 mt-2 mb-12 min-w-[400px] text-base font-sans">
			<TokenOption />
			<ServiceToggleOption className="mt-8" />
			<RecordTimingOption className="mt-8" />
			<PreventDuplicateOption className="mt-8" />
		</div>
	);
}

export default App;
