import {
	CircleCheck,
	CircleX,
	Info,
	LoaderCircle,
	TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="light"
			className="toaster group"
			position="top-right"
			duration={1500}
			icons={{
				success: <CircleCheck className="h-4 w-4" />,
				info: <Info className="h-4 w-4" />,
				warning: <TriangleAlert className="h-4 w-4" />,
				error: <CircleX className="size-5 text-red-500 mr-10" />,
				loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
			}}
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
