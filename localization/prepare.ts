import { cp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	DETECT_LOCALE_FN,
	LANGUAGE_SECTION_CODE,
	LAYOUT_CLOSE_ARIA,
	LAYOUT_CLOSE_PANELS_ARIA,
	LAYOUT_HOOK,
	LAYOUT_INSPECTOR_LABEL,
	LAYOUT_MOBILE_CLOSE_HOOK,
	LAYOUT_TOGGLE_INSP_ARIA,
	LAYOUT_TOGGLE_INSP_TITLE,
	LAYOUT_TOGGLE_SESS_ARIA,
	LAYOUT_TOGGLE_SESS_TITLE,
	LAYOUT_TOOL_CARDS_ARIA,
	LAYOUT_TOOL_CARDS_HOOK,
	LAYOUT_TOOL_CARDS_TITLE,
	NAV_RAIL_HOOK,
	NAV_RAIL_ITEMS,
	NAV_RAIL_LABEL,
	NAV_RAIL_SETTINGS_ARIA,
	NAV_RAIL_SETTINGS_TITLE,
	NOTIFICATION_BANNER_BLOCKED,
	NOTIFICATION_BANNER_DISMISS,
	NOTIFICATION_BANNER_ENABLE,
	NOTIFICATION_BANNER_HOOK,
	NOTIFICATION_BANNER_NOT_NOW,
	NOTIFICATION_BANNER_PROMPT,
	NOTIFICATION_TOAST_DISMISS_ARIA,
	NOTIFICATION_TOAST_HOOK,
	NOTIFICATION_TOAST_VIEW,
	SETTINGS_APPEARANCE_TITLE,
	SETTINGS_ENV_TITLE,
	SETTINGS_LANG_BRANCH,
	SETTINGS_MESSAGING_TITLE,
	SETTINGS_NOTES_BODY,
	SETTINGS_NOTES_TITLE,
	SETTINGS_NOTIFICATIONS_TITLE,
	SETTINGS_ORIENTATION_TITLE,
	SETTINGS_PROVIDERS_LOADING,
	SETTINGS_PROVIDERS_META,
	SETTINGS_SIDE_RAIL,
	SETTINGS_STUB_BODY,
	SETTINGS_STUB_SECTION_SIG,
	SETTINGS_STUB_TITLE,
	SETTINGS_TOP_SUBTITLE,
	SETTINGS_TOP_TITLE,
	SIDEBAR_ALL_WS_OPTION,
	SIDEBAR_HOOK,
	SIDEBAR_LIVE_ARIA,
	SIDEBAR_NEW_SESSION,
	SIDEBAR_NO_SESSIONS,
	SIDEBAR_PLAN_MODE_TITLE,
	SIDEBAR_REFRESH_SESS_ARIA,
	SIDEBAR_REFRESH_WS_ARIA,
	SIDEBAR_SESSION_ROW_HOOK,
	SIDEBAR_SESSIONS_SUMMARY,
	SIDEBAR_WORKSPACE_LABEL,
	ZH_SETTINGS_SECTIONS,
} from "./translations.js";

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
	await transformGeneratedFile(path.join("i18n", "index.ts"), localizeI18nIndex);
	await transformGeneratedFile(path.join("views", "SettingsView.tsx"), localizeSettingsView);
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
	next = replaceOne(next, /const ITEMS: ReadonlyArray<\{[\s\S]*?\n\];/, NAV_RAIL_ITEMS, "NavRail: items config");
	next = replaceOne(next, /export function NavRail\(\) \{\s*return \(/, NAV_RAIL_HOOK, "NavRail: inject translation hook");
	next = replaceOne(next, "item.label", NAV_RAIL_LABEL, "NavRail: item label usage");
	next = replaceOne(next, 'title="Settings"', NAV_RAIL_SETTINGS_TITLE, "NavRail: settings title");
	next = replaceOne(next, 'aria-label="Settings"', NAV_RAIL_SETTINGS_ARIA, "NavRail: settings aria");
	return next;
}

function localizeSidebar(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function Sidebar\(\) \{\s*const workspaces = useStore\(\(s\) => s\.workspaces\);/,
		SIDEBAR_HOOK,
		"Sidebar: inject root translation hook",
	);
	next = replaceOne(next, '<div className="meta">Workspace</div>', SIDEBAR_WORKSPACE_LABEL, "Sidebar: workspace label");
	next = replaceOne(next, 'aria-label="Refresh workspaces"', SIDEBAR_REFRESH_WS_ARIA, "Sidebar: refresh workspaces");
	next = replaceOne(next, '<option value="">(all workspaces)</option>', SIDEBAR_ALL_WS_OPTION, "Sidebar: all workspaces option");
	next = replaceOne(next, />\s*New session\s*</, SIDEBAR_NEW_SESSION, "Sidebar: new session button");
	next = replaceOne(
		next,
		/<div className="meta">Sessions[\s\S]*?\{filtered\.length\}<\/div>/,
		SIDEBAR_SESSIONS_SUMMARY,
		"Sidebar: sessions summary",
	);
	next = replaceOne(next, 'aria-label="Refresh sessions"', SIDEBAR_REFRESH_SESS_ARIA, "Sidebar: refresh sessions");
	next = replaceOne(next, />\s*No sessions yet\.\s*</, SIDEBAR_NO_SESSIONS, "Sidebar: empty state");
	next = replaceOne(
		next,
		/onClick: \(\) => void;\n\}\) \{\n\treturn \(/,
		SIDEBAR_SESSION_ROW_HOOK,
		"Sidebar: inject SessionRow translation hook",
	);
	next = replaceOne(next, 'aria-label="live"', SIDEBAR_LIVE_ARIA, "Sidebar: live status");
	next = replaceOne(next, 'title="Plan mode active"', SIDEBAR_PLAN_MODE_TITLE, "Sidebar: plan mode title");
	return next;
}

function localizeNotificationPermissionBanner(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function NotificationPermissionBanner\(\): JSX\.Element \| null \{\s*const \{ permission, requestPermission, bannerDismissed, dismissBanner \} = useNotificationPermission\(\);/,
		NOTIFICATION_BANNER_HOOK,
		"NotificationPermissionBanner: inject translation hook",
	);
	next = replaceOne(
		next,
		/<span>\s*OS notifications are blocked\.[\s\S]*?<\/span>/,
		NOTIFICATION_BANNER_BLOCKED,
		"NotificationPermissionBanner: blocked copy",
	);
	next = replaceOne(next, />\s*Dismiss\s*</, NOTIFICATION_BANNER_DISMISS, "NotificationPermissionBanner: dismiss button");
	next = replaceOne(
		next,
		/<span>\s*Enable browser notifications so the deck can ping you when a routine fails or needs attention\.\s*<\/span>/,
		NOTIFICATION_BANNER_PROMPT,
		"NotificationPermissionBanner: prompt copy",
	);
	next = replaceOne(next, />\s*Enable notifications\s*</, NOTIFICATION_BANNER_ENABLE, "NotificationPermissionBanner: enable button");
	next = replaceOne(next, />\s*Not now\s*</, NOTIFICATION_BANNER_NOT_NOW, "NotificationPermissionBanner: not now button");
	return next;
}

function localizeNotificationToast(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function NotificationToast\(\): JSX\.Element \| null \{\s*const notifications = useStore\(\(s\) => s\.notifications\);/,
		NOTIFICATION_TOAST_HOOK,
		"NotificationToast: inject translation hook",
	);
	next = replaceOne(next, />\s*View\s*</, NOTIFICATION_TOAST_VIEW, "NotificationToast: view action");
	next = replaceOne(next, 'aria-label="Dismiss notification"', NOTIFICATION_TOAST_DISMISS_ARIA, "NotificationToast: dismiss aria");
	return next;
}

function localizeLayout(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function Layout\(\{ sidebar, main, inspector, topBar \}: Props\) \{\s*const sidebarOpen = useStore\(\(s\) => s\.sidebarOpen\);/,
		LAYOUT_HOOK,
		"Layout: inject root translation hook",
	);
	next = replaceOne(next, 'aria-label="Toggle sessions"', LAYOUT_TOGGLE_SESS_ARIA, "Layout: toggle sessions aria");
	next = replaceOne(next, 'title="Toggle sessions"', LAYOUT_TOGGLE_SESS_TITLE, "Layout: toggle sessions title");
	next = replaceOne(next, 'aria-label="Toggle inspector"', LAYOUT_TOGGLE_INSP_ARIA, "Layout: toggle inspector aria");
	next = replaceOne(next, 'title="Toggle inspector"', LAYOUT_TOGGLE_INSP_TITLE, "Layout: toggle inspector title");
	next = replaceOne(next, 'aria-label="Close panels"', LAYOUT_CLOSE_PANELS_ARIA, "Layout: close panels aria");
	next = replaceOne(
		next,
		/function MobileCloseBar\(\{ onClose, side \}: \{ onClose: \(\) => void; side: "left" \| "right" \}\) \{\s*return \(/,
		LAYOUT_MOBILE_CLOSE_HOOK,
		"Layout: inject MobileCloseBar translation hook",
	);
	next = replaceOne(next, />\s*Inspector\s*</, LAYOUT_INSPECTOR_LABEL, "Layout: inspector label");
	next = replaceOne(next, 'aria-label="Close"', LAYOUT_CLOSE_ARIA, "Layout: close button aria");
	next = replaceOne(
		next,
		/function ToolCardsToggle\(\) \{\s*const allCollapsed = useStore\(\(s\) => s\.toolView\.allCollapsed\);/,
		LAYOUT_TOOL_CARDS_HOOK,
		"Layout: inject ToolCardsToggle translation hook",
	);
	next = replaceOne(
		next,
		'aria-label={allCollapsed ? "Expand all tool cards" : "Collapse all tool cards"}',
		LAYOUT_TOOL_CARDS_ARIA,
		"Layout: tool cards aria",
	);
	next = replaceOne(
		next,
		'title={allCollapsed ? "Expand all tool cards" : "Collapse all tool cards"}',
		LAYOUT_TOOL_CARDS_TITLE,
		"Layout: tool cards title",
	);
	return next;
}

function localizeI18nIndex(source: string): string {
	return replaceOne(
		source,
		/function detectLocale\(\): string \{[\s\S]*?\n\}/,
		DETECT_LOCALE_FN,
		"i18n index: default zh locale",
	);
}

function localizeSettingsView(source: string): string {
	let next = injectNamedImport(source, "@/i18n/useLocale", "useLocale");
	next = replaceOne(next, /const SECTIONS = \[[\s\S]*?\] as const;/, ZH_SETTINGS_SECTIONS, "SettingsView: localized sections");
	next = replaceOne(next, '<div className="meta">Settings</div>', SETTINGS_TOP_TITLE, "SettingsView: top title");
	next = replaceOne(next, '<div className="text-xs text-ink-3">Configure this local deck instance</div>', SETTINGS_TOP_SUBTITLE, "SettingsView: top subtitle");
	next = replaceOne(
		next,
		`) : selected === "appearance" ? (
\t\t\t\t\t\t\t\t<AppearanceSection />
\t\t\t\t\t\t\t) : selected === "notifications" ? (`,
		SETTINGS_LANG_BRANCH,
		"SettingsView: language section branch",
	);
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Environment variables</h1>', SETTINGS_ENV_TITLE, "SettingsView: env title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Messaging bridges</h1>', SETTINGS_MESSAGING_TITLE, "SettingsView: messaging title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Appearance</h1>', SETTINGS_APPEARANCE_TITLE, "SettingsView: appearance title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Notifications</h1>', SETTINGS_NOTIFICATIONS_TITLE, "SettingsView: notifications title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Orientation</h1>', SETTINGS_ORIENTATION_TITLE, "SettingsView: orientation title");
	next = replaceOne(next, '<div className="meta">Settings notes</div>', SETTINGS_NOTES_TITLE, "SettingsView: notes title");
	next = replaceOne(next, '<p>Secrets are masked in list responses. Replace values here; do not reveal unless using the loopback API directly.</p>', SETTINGS_NOTES_BODY, "SettingsView: notes body");
	next = replaceOne(next, '<div className="p-3 text-xs text-ink-3">Settings</div>', SETTINGS_SIDE_RAIL, "SettingsView: side rail");
	next = replaceOne(next, '<h1 className="mt-2 text-xl font-semibold">Not built yet</h1>', SETTINGS_STUB_TITLE, "SettingsView: stub title");
	next = replaceOne(next, '<p className="mt-1 text-sm text-ink-3">This section is reserved so the settings layout is stable.</p>', SETTINGS_STUB_BODY, "SettingsView: stub body");
	next = replaceOne(
		next,
		/if \(loading\) \{\s*return <div className="font-mono text-2xs text-ink-3">Loading providers[\s\S]*?<\/div>;\s*\}/,
		SETTINGS_PROVIDERS_LOADING,
		"SettingsView: providers loading",
	);
	next = replaceOne(next, '<h2 className="meta">Providers</h2>', SETTINGS_PROVIDERS_META, "SettingsView: providers meta");
	next = replaceOne(
		next,
		'function StubSection({ section }: { section: Exclude<SectionId, "env" | "messaging" | "appearance" | "notifications"> }) {',
		`${LANGUAGE_SECTION_CODE}\n\n${SETTINGS_STUB_SECTION_SIG}`,
		"SettingsView: insert language section",
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
