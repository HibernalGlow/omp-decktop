import { useEffect } from "react";
import { AppRouter } from "./router";
import { useStore } from "./lib/store";
import { useNotificationBridge } from "./lib/notifications";
import { NotificationToast } from "./components/NotificationToast";
import { NotificationPermissionBanner } from "./components/NotificationPermissionBanner";

export function App() {
	const bootstrap = useStore((s) => s.bootstrap);
	useNotificationBridge();

	useEffect(() => {
		void bootstrap();
	}, [bootstrap]);

	return (
		<>
			<NotificationPermissionBanner />
			<AppRouter />
			<NotificationToast />
		</>
	);
}
