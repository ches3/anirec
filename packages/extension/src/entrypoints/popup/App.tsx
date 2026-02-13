import { Settings } from "lucide-react";
import { PageState } from "./components/PageState";

export default function App() {
	return (
		<div className="w-100 h-120 p-4 flex flex-col overflow-y-auto text-base font-sans">
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center gap-2">
					<img src="/icon/128.png" alt="AniRec" className="w-5 h-5 mb-1" />
					<h1 className="font-semibold text-lg">AniRec</h1>
				</div>
				<button
					type="button"
					className="text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => browser.runtime.openOptionsPage()}
				>
					<Settings className="w-5 h-5" />
				</button>
			</div>
			<div className="p-2">
				<PageState />
			</div>
		</div>
	);
}
