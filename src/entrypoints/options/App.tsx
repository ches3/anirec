import { RecordTimingOption } from "./RecordTimingOption";
import { ServiceToggleOption } from "./ServiceToggleOption";
import { TokenOption } from "./TokenOption";

function App() {
	return (
		<div className="mx-6 mt-2 mb-8 text-base">
			<TokenOption />
			<ServiceToggleOption className="mt-6" />
			<RecordTimingOption className="mt-6" />
		</div>
	);
}

export default App;
