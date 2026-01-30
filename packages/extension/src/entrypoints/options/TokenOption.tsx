import { Button } from "@/components/ui/button";
import { generateToken, revokeToken } from "@/utils/auth";
import { cn } from "@/utils/cn";

function LoginButton({
	setExists,
	className,
}: {
	setExists: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}) {
	const handleClick = async () => {
		try {
			await generateToken();
			setExists(true);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Button
			type="button"
			onClick={handleClick}
			className={cn(
				"bg-annict text-annict-foreground hover:bg-annict-hover",
				className,
			)}
		>
			ログイン
		</Button>
	);
}

function LogoutButton({
	setExists,
	className,
}: {
	setExists: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}) {
	const handleClick = async () => {
		try {
			await revokeToken();
			setExists(false);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Button
			type="button"
			onClick={handleClick}
			variant="secondary"
			className={cn("hover:bg-secondary-hover", className)}
		>
			ログアウト
		</Button>
	);
}

export function TokenOption({ className }: { className?: string }) {
	const [existsToken, setExistsToken] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const token = await storage.getItem<string>("sync:token");
			setExistsToken(!!token);
		})();
	}, []);

	return (
		<div className={className}>
			<h2 className="font-bold text-lg">Annict連携</h2>
			{existsToken ? (
				<LogoutButton setExists={setExistsToken} className="mt-4" />
			) : (
				<LoginButton setExists={setExistsToken} className="mt-4" />
			)}
		</div>
	);
}
