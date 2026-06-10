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

function localizeI18nIndex(source: string): string {
	return replaceOne(
		source,
		/function detectLocale\(\): string \{[\s\S]*?\n\}/,
		`function detectLocale(): string {
\ttry {
\t\tconst stored = localStorage.getItem(LOCALE_STORAGE_KEY);
\t\tif (stored && (stored === "en" || stored === "zh-CN")) return stored;
\t} catch {
\t\t/* quota / private browsing */
\t}
\treturn "zh-CN";
\t}`,
		"i18n index: default zh locale",
	);
}

function localizeSettingsView(source: string): string {
	let next = injectNamedImport(source, "@/i18n/useLocale", "useLocale");
	next = replaceOne(
		next,
		/const SECTIONS = \[[\s\S]*?\] as const;/,
		`const SECTIONS = [
\t{ id: "env", label: "环境变量", description: "进程及 Deck 管理的变量" },
\t{ id: "providers", label: "服务商", description: "OAuth 登录与 API 密钥状态" },
\t{ id: "messaging", label: "消息桥接", description: "Telegram 及未来的聊天桥接" },
\t{ id: "orientation", label: "引导配置", description: "Prelude、/start、维护门控" },
\t{ id: "appearance", label: "外观", description: "主题、颜色、字体" },
\t{ id: "language", label: "语言", description: "界面显示语言" },
\t{ id: "workspaces", label: "工作区", description: "固定根目录与显示名称" },
\t{ id: "notifications", label: "通知", description: "空闲提醒与免打扰时段" },
\t{ id: "about", label: "关于", description: "版本、路径、诊断信息" },
] as const;`,
		"SettingsView: localized sections",
	);
	next = replaceOne(next, '<div className="meta">Settings</div>', '<div className="meta">设置</div>', "SettingsView: top title");
	next = replaceOne(next, '<div className="text-xs text-ink-3">Configure this local deck instance</div>', '<div className="text-xs text-ink-3">配置此本地 Deck 实例</div>', "SettingsView: top subtitle");
	next = replaceOne(
		next,
		`) : selected === "appearance" ? (
\t\t\t\t\t\t\t\t<AppearanceSection />
\t\t\t\t\t\t\t) : selected === "notifications" ? (`,
		`) : selected === "appearance" ? (
\t\t\t\t\t\t\t\t<AppearanceSection />
\t\t\t\t\t\t\t) : selected === "language" ? (
\t\t\t\t\t\t\t\t<LanguageSection />
\t\t\t\t\t\t\t) : selected === "notifications" ? (`,
		"SettingsView: language section branch",
	);
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Environment variables</h1>', '<h1 className="text-xl font-semibold tracking-tight">环境变量</h1>', "SettingsView: env title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Messaging bridges</h1>', '<h1 className="text-xl font-semibold tracking-tight">消息桥接</h1>', "SettingsView: messaging title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Appearance</h1>', '<h1 className="text-xl font-semibold tracking-tight">外观</h1>', "SettingsView: appearance title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Notifications</h1>', '<h1 className="text-xl font-semibold tracking-tight">通知</h1>', "SettingsView: notifications title");
	next = replaceOne(next, '<h1 className="text-xl font-semibold tracking-tight">Orientation</h1>', '<h1 className="text-xl font-semibold tracking-tight">引导配置</h1>', "SettingsView: orientation title");
	next = replaceOne(next, '<div className="meta">Settings notes</div>', '<div className="meta">设置说明</div>', "SettingsView: notes title");
	next = replaceOne(next, '<p>Secrets are masked in list responses. Replace values here; do not reveal unless using the loopback API directly.</p>', '<p>列表中的敏感信息会被掩码显示。在这里替换即可；除非你直接调用本机回环 API，否则不要明文暴露。</p>', "SettingsView: notes body");
	next = replaceOne(next, '<div className="p-3 text-xs text-ink-3">Settings</div>', '<div className="p-3 text-xs text-ink-3">设置</div>', "SettingsView: side rail");
	next = replaceOne(next, '<h1 className="mt-2 text-xl font-semibold">Not built yet</h1>', '<h1 className="mt-2 text-xl font-semibold">尚未构建</h1>', "SettingsView: stub title");
	next = replaceOne(next, '<p className="mt-1 text-sm text-ink-3">This section is reserved so the settings layout is stable.</p>', '<p className="mt-1 text-sm text-ink-3">此区域仅作占位，以保持设置布局稳定。</p>', "SettingsView: stub body");
	next = replaceOne(
		next,
		/if \(loading\) \{\s*return <div className="font-mono text-2xs text-ink-3">Loading providers[\s\S]*?<\/div>;\s*\}/,
		'if (loading) {\n\t\treturn <div className="font-mono text-2xs text-ink-3">正在加载服务商...</div>;\n\t}',
		"SettingsView: providers loading",
	);
	next = replaceOne(next, '<h2 className="meta">Providers</h2>', '<h2 className="meta">服务商</h2>', "SettingsView: providers meta");
	next = replaceOne(
		next,
		'function StubSection({ section }: { section: Exclude<SectionId, "env" | "messaging" | "appearance" | "notifications"> }) {',
		`function LanguageSection() {
\tconst { locale, setLocale } = useLocale();
\treturn (
\t\t<div className="mx-auto max-w-3xl space-y-4">
\t\t\t<div>
\t\t\t\t<h1 className="text-xl font-semibold tracking-tight">语言</h1>
\t\t\t\t<p className="mt-1 text-sm text-ink-3">切换界面显示语言。设置会保存在当前桌面应用的本地存储中。</p>
\t\t\t</div>
\t\t\t<div className="rounded-md border border-line bg-paper p-4">
\t\t\t\t<div className="space-y-2">
\t\t\t\t\t<button
\t\t\t\t\t\ttype="button"
\t\t\t\t\t\tonClick={() => setLocale("zh-CN")}
\t\t\t\t\t\tclassName={cn(
\t\t\t\t\t\t\t"flex w-full items-center justify-between rounded-md border px-3 py-3 text-left transition-colors",
\t\t\t\t\t\t\tlocale === "zh-CN" ? "border-accent bg-accent-soft/20 text-accent" : "border-line hover:bg-paper-2",
\t\t\t\t\t\t)}
\t\t\t\t\t>
\t\t\t\t\t\t<span className="font-medium">简体中文</span>
\t\t\t\t\t\t<span className="font-mono text-2xs text-ink-3">zh-CN</span>
\t\t\t\t\t</button>
\t\t\t\t\t<button
\t\t\t\t\t\ttype="button"
\t\t\t\t\t\tonClick={() => setLocale("en")}
\t\t\t\t\t\tclassName={cn(
\t\t\t\t\t\t\t"flex w-full items-center justify-between rounded-md border px-3 py-3 text-left transition-colors",
\t\t\t\t\t\t\tlocale === "en" ? "border-accent bg-accent-soft/20 text-accent" : "border-line hover:bg-paper-2",
\t\t\t\t\t\t)}
\t\t\t\t\t>
\t\t\t\t\t\t<span className="font-medium">English</span>
\t\t\t\t\t\t<span className="font-mono text-2xs text-ink-3">en</span>
\t\t\t\t\t</button>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t);
}

function StubSection({ section }: { section: Exclude<SectionId, "env" | "messaging" | "appearance" | "notifications" | "language"> }) {`,
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
