import { cp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const webRoot = path.join(repoRoot, "apps", "web");
const generatedRoot = path.join(repoRoot, ".generated", "web-root-i18n");
const generatedSrc = path.join(generatedRoot, "src");

async function main(): Promise<void> {
	await rm(generatedRoot, { recursive: true, force: true });
	await mkdir(generatedRoot, { recursive: true });
	await symlink(path.join(webRoot, "node_modules"), path.join(generatedRoot, "node_modules"), "junction");

	await cp(path.join(webRoot, "public"), path.join(generatedRoot, "public"), { recursive: true });
	await cp(path.join(webRoot, "src"), generatedSrc, { recursive: true });

	await rewriteGeneratedStyles();
	await localizeGeneratedFiles();
	await writeLocalizedIndexHtml();
	await writeLocalizedMain();
}

async function rewriteGeneratedStyles(): Promise<void> {
	const stylesPath = path.join(generatedSrc, "styles.css");
	const source = await readFile(stylesPath, "utf8");
	const rewritten = source
		.replaceAll('@import "@fontsource/', '@import "../../../apps/web/node_modules/@fontsource/')
		.replaceAll('@import "highlight.js/', '@import "../../../apps/web/node_modules/highlight.js/');
	await writeFile(stylesPath, rewritten, "utf8");
}

async function localizeGeneratedFiles(): Promise<void> {
	await transformGeneratedFile(path.join("components", "NavRail.tsx"), localizeNavRail);
	await transformGeneratedFile(path.join("components", "Sidebar.tsx"), localizeSidebar);
	await transformGeneratedFile(
		path.join("components", "NotificationPermissionBanner.tsx"),
		localizeNotificationPermissionBanner,
	);
	await transformGeneratedFile(path.join("components", "NotificationToast.tsx"), localizeNotificationToast);
	await transformGeneratedFile(path.join("components", "Layout.tsx"), localizeLayout);
}

async function transformGeneratedFile(relPath: string, transform: (source: string) => string): Promise<void> {
	const fullPath = path.join(generatedSrc, relPath);
	const source = await readFile(fullPath, "utf8");
	await writeFile(fullPath, transform(source), "utf8");
}

async function writeLocalizedIndexHtml(): Promise<void> {
	const indexHtml = await readFile(path.join(webRoot, "index.html"), "utf8");
	await writeFile(
		path.join(generatedRoot, "index.html"),
		indexHtml.replace('/src/main.tsx', '/src/main.zh.tsx'),
		"utf8",
	);
}

async function writeLocalizedMain(): Promise<void> {
	const mainSource = await readFile(path.join(webRoot, "src", "main.tsx"), "utf8");
	const localizedMain = mainSource.includes('./i18n"') || mainSource.includes("./i18n'")
		? mainSource
		: mainSource.replace('import "./styles.css";', 'import "./styles.css";\nimport "./i18n";');
	await writeFile(path.join(generatedSrc, "main.zh.tsx"), localizedMain, "utf8");
}

function localizeNavRail(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/const ITEMS: ReadonlyArray<\{[\s\S]*?\n\];/,
		`const ITEMS: ReadonlyArray<{
\tto: string;
\tlabelKey: string;
\ticon: typeof MessagesSquare;
}> = [
\t{ to: "/", labelKey: "nav.chat", icon: MessagesSquare },
\t{ to: "/tasks", labelKey: "nav.tasks", icon: KanbanSquare },
\t{ to: "/routines", labelKey: "nav.routines", icon: Clock },
\t{ to: "/inbox", labelKey: "nav.inbox", icon: Inbox },
\t{ to: "/marketplace", labelKey: "nav.marketplace", icon: Store },
\t{ to: "/skills", labelKey: "nav.skills", icon: Sparkles },
\t{ to: "/kb", labelKey: "nav.knowledge", icon: BookOpen },
\t{ to: "/integrations", labelKey: "nav.integrations", icon: Plug },
];`,
		"NavRail: items config",
	);
	next = replaceOne(
		next,
		/export function NavRail\(\) \{\s*return \(/,
		'export function NavRail() {\n\tconst { t } = useTranslation();\n\treturn (',
		"NavRail: inject translation hook",
	);
	next = replaceOne(next, "item.label", "t(item.labelKey)", "NavRail: item label usage");
	next = replaceOne(next, 'title="Settings"', 'title={t("nav.settings")}', "NavRail: settings title");
	next = replaceOne(next, 'aria-label="Settings"', 'aria-label={t("nav.settings")}', "NavRail: settings aria");
	return next;
}

function localizeSidebar(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function Sidebar\(\) \{\s*const workspaces = useStore\(\(s\) => s\.workspaces\);/,
		'export function Sidebar() {\n\tconst { t } = useTranslation();\n\tconst workspaces = useStore((s) => s.workspaces);',
		"Sidebar: inject root translation hook",
	);
	next = replaceOne(next, '<div className="meta">Workspace</div>', '<div className="meta">{t("sidebar.workspace")}</div>', "Sidebar: workspace label");
	next = replaceOne(next, 'aria-label="Refresh workspaces"', 'aria-label={t("sidebar.refreshWorkspaces")}', "Sidebar: refresh workspaces");
	next = replaceOne(next, '<option value="">(all workspaces)</option>', '<option value="">{t("sidebar.allWorkspaces")}</option>', "Sidebar: all workspaces option");
	next = replaceOne(next, />\s*New session\s*</, '>{t("sidebar.newSession")}<', "Sidebar: new session button");
	next = replaceOne(
		next,
		/<div className="meta">Sessions[\s\S]*?\{filtered\.length\}<\/div>/,
		'<div className="meta">{t("sidebar.sessions")} / {filtered.length}</div>',
		"Sidebar: sessions summary",
	);
	next = replaceOne(next, 'aria-label="Refresh sessions"', 'aria-label={t("sidebar.refreshSessions")}', "Sidebar: refresh sessions");
	next = replaceOne(next, />\s*No sessions yet\.\s*</, '>{t("sidebar.noSessions")}<', "Sidebar: empty state");
	next = replaceOne(
		next,
		/onClick: \(\) => void;\n\}\) \{\n\treturn \(/,
		'onClick: () => void;\n}) {\n\tconst { t } = useTranslation();\n\treturn (',
		"Sidebar: inject SessionRow translation hook",
	);
	next = replaceOne(next, 'aria-label="live"', 'aria-label={t("common.status.active")}', "Sidebar: live status");
	next = replaceOne(next, 'title="Plan mode active"', 'title={t("common.status.active")}', "Sidebar: plan mode title");
	return next;
}

function localizeNotificationPermissionBanner(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function NotificationPermissionBanner\(\): JSX\.Element \| null \{\s*const \{ permission, requestPermission, bannerDismissed, dismissBanner \} = useNotificationPermission\(\);/,
		'export function NotificationPermissionBanner(): JSX.Element | null {\n\tconst { t } = useTranslation();\n\tconst { permission, requestPermission, bannerDismissed, dismissBanner } = useNotificationPermission();',
		"NotificationPermissionBanner: inject translation hook",
	);
	next = replaceOne(
		next,
		/<span>\s*OS notifications are blocked\.[\s\S]*?<\/span>/,
		'<span>{t("notifications.permission.blocked")}</span>',
		"NotificationPermissionBanner: blocked copy",
	);
	next = replaceOne(next, />\s*Dismiss\s*</, '>{t("common.actions.dismiss")}<', "NotificationPermissionBanner: dismiss button");
	next = replaceOne(
		next,
		/<span>\s*Enable browser notifications so the deck can ping you when a routine fails or needs attention\.\s*<\/span>/,
		'<span>{t("notifications.permission.prompt")}</span>',
		"NotificationPermissionBanner: prompt copy",
	);
	next = replaceOne(next, />\s*Enable notifications\s*</, '>{t("notifications.permission.enable")}<', "NotificationPermissionBanner: enable button");
	next = replaceOne(next, />\s*Not now\s*</, '>{t("notifications.permission.notNow")}<', "NotificationPermissionBanner: not now button");
	return next;
}

function localizeNotificationToast(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function NotificationToast\(\): JSX\.Element \| null \{\s*const notifications = useStore\(\(s\) => s\.notifications\);/,
		'export function NotificationToast(): JSX.Element | null {\n\tconst { t } = useTranslation();\n\tconst notifications = useStore((s) => s.notifications);',
		"NotificationToast: inject translation hook",
	);
	next = replaceOne(next, />\s*View\s*</, '>{t("notifications.toast.view")}<', "NotificationToast: view action");
	next = replaceOne(next, 'aria-label="Dismiss notification"', 'aria-label={t("notifications.toast.dismissNotification")}', "NotificationToast: dismiss aria");
	return next;
}

function localizeLayout(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function Layout\(\{ sidebar, main, inspector, topBar \}: Props\) \{\s*const sidebarOpen = useStore\(\(s\) => s\.sidebarOpen\);/,
		'export function Layout({ sidebar, main, inspector, topBar }: Props) {\n\tconst { t } = useTranslation();\n\tconst sidebarOpen = useStore((s) => s.sidebarOpen);',
		"Layout: inject root translation hook",
	);
	next = replaceOne(next, 'aria-label="Toggle sessions"', 'aria-label={t("layout.toggleSessions")}', "Layout: toggle sessions aria");
	next = replaceOne(next, 'title="Toggle sessions"', 'title={t("layout.toggleSessions")}', "Layout: toggle sessions title");
	next = replaceOne(next, 'aria-label="Toggle inspector"', 'aria-label={t("layout.toggleInspector")}', "Layout: toggle inspector aria");
	next = replaceOne(next, 'title="Toggle inspector"', 'title={t("layout.toggleInspector")}', "Layout: toggle inspector title");
	next = replaceOne(next, 'aria-label="Close panels"', 'aria-label={t("layout.closePanels")}', "Layout: close panels aria");
	next = replaceOne(
		next,
		/function MobileCloseBar\(\{ onClose, side \}: \{ onClose: \(\) => void; side: "left" \| "right" \}\) \{\s*return \(/,
		'function MobileCloseBar({ onClose, side }: { onClose: () => void; side: "left" | "right" }) {\n\tconst { t } = useTranslation();\n\treturn (',
		"Layout: inject MobileCloseBar translation hook",
	);
	next = replaceOne(next, />\s*Inspector\s*</, '>{t("layout.inspector")}<', "Layout: inspector label");
	next = replaceOne(next, 'aria-label="Close"', 'aria-label={t("common.actions.close")}', "Layout: close button aria");
	next = replaceOne(
		next,
		/function ToolCardsToggle\(\) \{\s*const allCollapsed = useStore\(\(s\) => s\.toolView\.allCollapsed\);/,
		'function ToolCardsToggle() {\n\tconst { t } = useTranslation();\n\tconst allCollapsed = useStore((s) => s.toolView.allCollapsed);',
		"Layout: inject ToolCardsToggle translation hook",
	);
	next = replaceOne(
		next,
		'aria-label={allCollapsed ? "Expand all tool cards" : "Collapse all tool cards"}',
		'aria-label={allCollapsed ? t("layout.expandAllToolCards") : t("layout.collapseAllToolCards")}',
		"Layout: tool cards aria",
	);
	next = replaceOne(
		next,
		'title={allCollapsed ? "Expand all tool cards" : "Collapse all tool cards"}',
		'title={allCollapsed ? t("layout.expandAllToolCards") : t("layout.collapseAllToolCards")}',
		"Layout: tool cards title",
	);
	return next;
}

function replaceOne(source: string, search: RegExp | string, replacement: string, label: string): string {
	const next = source.replace(search, replacement);
	if (next === source) {
		throw new Error(`${label} not found`);
	}
	return next;
}

function injectNamedImport(source: string, moduleName: string, importName: string): string {
	const importLine = `import { ${importName} } from "${moduleName}";`;
	if (source.includes(importLine)) return source;

	const lines = source.split(/\r?\n/);
	const lastImportIndex = findLastImportIndex(lines);
	if (lastImportIndex === -1) return `${importLine}\n${source}`;
	lines.splice(lastImportIndex + 1, 0, importLine);
	return `${lines.join("\n")}\n`;
}

function findLastImportIndex(lines: string[]): number {
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		if (lines[i]?.startsWith("import ")) return i;
	}
	return -1;
}

void main().catch((error) => {
	console.error("[l10n:prepare] failed:", error);
	process.exitCode = 1;
});
