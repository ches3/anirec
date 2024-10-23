import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToken, saveToken } from "@/utils/settings";

function App() {
	const [token, setToken] = useState<string>();
	const [saved, setSaved] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			setToken((await getToken()) || "");
		})();
	}, []);

	const handleSave = async () => {
		if (!token) {
			return;
		}
		await saveToken(token);
		setSaved(true);
		setTimeout(() => {
			setSaved(false);
		}, 1000);
	};

	return (
		<div className="mx-6 mt-2 mb-8">
			<div>
				<Label>Annict Token</Label>
				<Input
					value={token}
					onChange={(e) => {
						setToken(e.target.value);
					}}
					className="mt-2"
				/>
			</div>
			<Button onClick={handleSave} className="mt-4 w-20">
				{saved ? "Saved!" : "Save"}
			</Button>
		</div>
	);
}

export default App;
