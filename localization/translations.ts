/**
 * Translation fields for the localization prepare script.
 * All translatable content and replacement templates are centralized here.
 */

// ─── i18n Keys ──────────────────────────────────────────────────────

export const NAV_RAIL_I18N = {
	settings: "nav.settings",
} as const;

export const SIDEBAR_I18N = {
	workspace: "sidebar.workspace",
	refreshWorkspaces: "sidebar.refreshWorkspaces",
	allWorkspaces: "sidebar.allWorkspaces",
	newSession: "sidebar.newSession",
	sessions: "sidebar.sessions",
	refreshSessions: "sidebar.refreshSessions",
	noSessions: "sidebar.noSessions",
	activeStatus: "common.status.active",
} as const;

export const NOTIFICATION_BANNER_I18N = {
	blocked: "notifications.permission.blocked",
	dismiss: "common.actions.dismiss",
	prompt: "notifications.permission.prompt",
	enable: "notifications.permission.enable",
	notNow: "notifications.permission.notNow",
} as const;

export const NOTIFICATION_TOAST_I18N = {
	view: "notifications.toast.view",
	dismissNotification: "notifications.toast.dismissNotification",
} as const;

export const LAYOUT_I18N = {
	toggleSessions: "layout.toggleSessions",
	toggleInspector: "layout.toggleInspector",
	closePanels: "layout.closePanels",
	inspector: "layout.inspector",
	close: "common.actions.close",
	expandAllToolCards: "layout.expandAllToolCards",
	collapseAllToolCards: "layout.collapseAllToolCards",
} as const;

// ─── NavRail Replacements ───────────────────────────────────────────

export const NAV_RAIL_ITEMS = `const ITEMS: ReadonlyArray<{
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
];`;

export const NAV_RAIL_HOOK = `export function NavRail() {
\tconst { t } = useTranslation();
\treturn (`;

export const NAV_RAIL_LABEL = "t(item.labelKey)";

export const NAV_RAIL_SETTINGS_TITLE = `title={t("${NAV_RAIL_I18N.settings}")}`;

export const NAV_RAIL_SETTINGS_ARIA = `aria-label={t("${NAV_RAIL_I18N.settings}")}`;

// ─── Sidebar Replacements ───────────────────────────────────────────

export const SIDEBAR_HOOK = `export function Sidebar() {
\tconst { t } = useTranslation();
\tconst workspaces = useStore((s) => s.workspaces);`;

export const SIDEBAR_WORKSPACE_LABEL = `<div className="meta">{t("${SIDEBAR_I18N.workspace}")}</div>`;

export const SIDEBAR_REFRESH_WS_ARIA = `aria-label={t("${SIDEBAR_I18N.refreshWorkspaces}")}`;

export const SIDEBAR_ALL_WS_OPTION = `<option value="">{t("${SIDEBAR_I18N.allWorkspaces}")}</option>`;

export const SIDEBAR_NEW_SESSION = `>{t("${SIDEBAR_I18N.newSession}")}<`;

export const SIDEBAR_SESSIONS_SUMMARY = `<div className="meta">{t("${SIDEBAR_I18N.sessions")} / {filtered.length}</div>`;

export const SIDEBAR_REFRESH_SESS_ARIA = `aria-label={t("${SIDEBAR_I18N.refreshSessions}")}`;

export const SIDEBAR_NO_SESSIONS = `>{t("${SIDEBAR_I18N.noSessions}")}<`;

export const SIDEBAR_SESSION_ROW_HOOK = `onClick: () => void;
}) {
\tconst { t } = useTranslation();
\treturn (`;

export const SIDEBAR_LIVE_ARIA = `aria-label={t("${SIDEBAR_I18N.activeStatus}")}`;

export const SIDEBAR_PLAN_MODE_TITLE = `title={t("${SIDEBAR_I18N.activeStatus}")}`;

// ─── NotificationPermissionBanner Replacements ──────────────────────

export const NOTIFICATION_BANNER_HOOK = `export function NotificationPermissionBanner(): JSX.Element | null {
\tconst { t } = useTranslation();
\tconst { permission, requestPermission, bannerDismissed, dismissBanner } = useNotificationPermission();`;

export const NOTIFICATION_BANNER_BLOCKED = `<span>{t("${NOTIFICATION_BANNER_I18N.blocked}")}</span>`;

export const NOTIFICATION_BANNER_DISMISS = `>{t("${NOTIFICATION_BANNER_I18N.dismiss}")}<`;

export const NOTIFICATION_BANNER_PROMPT = `<span>{t("${NOTIFICATION_BANNER_I18N.prompt}")}</span>`;

export const NOTIFICATION_BANNER_ENABLE = `>{t("${NOTIFICATION_BANNER_I18N.enable}")}<`;

export const NOTIFICATION_BANNER_NOT_NOW = `>{t("${NOTIFICATION_BANNER_I18N.notNow}")}<`;

// ─── NotificationToast Replacements ─────────────────────────────────

export const NOTIFICATION_TOAST_HOOK = `export function NotificationToast(): JSX.Element | null {
\tconst { t } = useTranslation();
\tconst notifications = useStore((s) => s.notifications);`;

export const NOTIFICATION_TOAST_VIEW = `>{t("${NOTIFICATION_TOAST_I18N.view}")}<`;

export const NOTIFICATION_TOAST_DISMISS_ARIA = `aria-label={t("${NOTIFICATION_TOAST_I18N.dismissNotification}")}`;

// ─── Layout Replacements ────────────────────────────────────────────

export const LAYOUT_HOOK = `export function Layout({ sidebar, main, inspector, topBar }: Props) {
\tconst { t } = useTranslation();
\tconst sidebarOpen = useStore((s) => s.sidebarOpen);`;

export const LAYOUT_TOGGLE_SESS_ARIA = `aria-label={t("${LAYOUT_I18N.toggleSessions}")}`;

export const LAYOUT_TOGGLE_SESS_TITLE = `title={t("${LAYOUT_I18N.toggleSessions}")}`;

export const LAYOUT_TOGGLE_INSP_ARIA = `aria-label={t("${LAYOUT_I18N.toggleInspector}")}`;

export const LAYOUT_TOGGLE_INSP_TITLE = `title={t("${LAYOUT_I18N.toggleInspector}")}`;

export const LAYOUT_CLOSE_PANELS_ARIA = `aria-label={t("${LAYOUT_I18N.closePanels}")}`;

export const LAYOUT_MOBILE_CLOSE_HOOK = `function MobileCloseBar({ onClose, side }: { onClose: () => void; side: "left" | "right" }) {
\tconst { t } = useTranslation();
\treturn (`;

export const LAYOUT_INSPECTOR_LABEL = `>{t("${LAYOUT_I18N.inspector}")}<`;

export const LAYOUT_CLOSE_ARIA = `aria-label={t("${LAYOUT_I18N.close}")}`;

export const LAYOUT_TOOL_CARDS_HOOK = `function ToolCardsToggle() {
\tconst { t } = useTranslation();
\tconst allCollapsed = useStore((s) => s.toolView.allCollapsed);`;

export const LAYOUT_TOOL_CARDS_ARIA = `aria-label={allCollapsed ? t("${LAYOUT_I18N.expandAllToolCards}") : t("${LAYOUT_I18N.collapseAllToolCards}")}`;

export const LAYOUT_TOOL_CARDS_TITLE = `title={allCollapsed ? t("${LAYOUT_I18N.expandAllToolCards}") : t("${LAYOUT_I18N.collapseAllToolCards}")}`;

// ─── i18n Config ────────────────────────────────────────────────────

export const DETECT_LOCALE_FN = `function detectLocale(): string {
\ttry {
\t\tconst stored = localStorage.getItem(LOCALE_STORAGE_KEY);
\t\tif (stored && (stored === "en" || stored === "zh-CN")) return stored;
\t} catch {
\t\t/* quota / private browsing */
\t}
\treturn "zh-CN";
\t}`;

// ─── SettingsView Replacements ──────────────────────────────────────

export const ZH_SETTINGS_SECTIONS = `const SECTIONS = [
\t{ id: "env", label: "环境变量", description: "进程及 Deck 管理的变量" },
\t{ id: "providers", label: "服务商", description: "OAuth 登录与 API 密钥状态" },
\t{ id: "messaging", label: "消息桥接", description: "Telegram 及未来的聊天桥接" },
\t{ id: "orientation", label: "引导配置", description: "Prelude、/start、维护门控" },
\t{ id: "appearance", label: "外观", description: "主题、颜色、字体" },
\t{ id: "language", label: "语言", description: "界面显示语言" },
\t{ id: "workspaces", label: "工作区", description: "固定根目录与显示名称" },
\t{ id: "notifications", label: "通知", description: "空闲提醒与免打扰时段" },
\t{ id: "about", label: "关于", description: "版本、路径、诊断信息" },
] as const;`;

export const ZH_SETTINGS_TEXT = {
	topTitle: "设置",
	topSubtitle: "配置此本地 Deck 实例",
	envTitle: "环境变量",
	messagingTitle: "消息桥接",
	appearanceTitle: "外观",
	notificationsTitle: "通知",
	orientationTitle: "引导配置",
	notesTitle: "设置说明",
	notesBody:
		"列表中的敏感信息会被掩码显示。在这里替换即可；除非你直接调用本机回环 API，否则不要明文暴露。",
	sideRail: "设置",
	stubTitle: "尚未构建",
	stubBody: "此区域仅作占位，以保持设置布局稳定。",
	providersLoading: "正在加载服务商...",
	providersMeta: "服务商",
} as const;

export const SETTINGS_TOP_TITLE = `<div className="meta">${ZH_SETTINGS_TEXT.topTitle}</div>`;

export const SETTINGS_TOP_SUBTITLE = `<div className="text-xs text-ink-3">${ZH_SETTINGS_TEXT.topSubtitle}</div>`;

export const SETTINGS_ENV_TITLE = `<h1 className="text-xl font-semibold tracking-tight">${ZH_SETTINGS_TEXT.envTitle}</h1>`;

export const SETTINGS_MESSAGING_TITLE = `<h1 className="text-xl font-semibold tracking-tight">${ZH_SETTINGS_TEXT.messagingTitle}</h1>`;

export const SETTINGS_APPEARANCE_TITLE = `<h1 className="text-xl font-semibold tracking-tight">${ZH_SETTINGS_TEXT.appearanceTitle}</h1>`;

export const SETTINGS_NOTIFICATIONS_TITLE = `<h1 className="text-xl font-semibold tracking-tight">${ZH_SETTINGS_TEXT.notificationsTitle}</h1>`;

export const SETTINGS_ORIENTATION_TITLE = `<h1 className="text-xl font-semibold tracking-tight">${ZH_SETTINGS_TEXT.orientationTitle}</h1>`;

export const SETTINGS_NOTES_TITLE = `<div className="meta">${ZH_SETTINGS_TEXT.notesTitle}</div>`;

export const SETTINGS_NOTES_BODY = `<p>${ZH_SETTINGS_TEXT.notesBody}</p>`;

export const SETTINGS_SIDE_RAIL = `<div className="p-3 text-xs text-ink-3">${ZH_SETTINGS_TEXT.sideRail}</div>`;

export const SETTINGS_STUB_TITLE = `<h1 className="mt-2 text-xl font-semibold">${ZH_SETTINGS_TEXT.stubTitle}</h1>`;

export const SETTINGS_STUB_BODY = `<p className="mt-1 text-sm text-ink-3">${ZH_SETTINGS_TEXT.stubBody}</p>`;

export const SETTINGS_PROVIDERS_LOADING = `if (loading) {
\t\treturn <div className="font-mono text-2xs text-ink-3">${ZH_SETTINGS_TEXT.providersLoading}</div>;
\t}`;

export const SETTINGS_PROVIDERS_META = `<h2 className="meta">${ZH_SETTINGS_TEXT.providersMeta}</h2>`;

export const SETTINGS_LANG_BRANCH = `) : selected === "appearance" ? (
\t\t\t\t\t\t\t\t<AppearanceSection />
\t\t\t\t\t\t\t) : selected === "language" ? (
\t\t\t\t\t\t\t\t<LanguageSection />
\t\t\t\t\t\t\t) : selected === "notifications" ? (`;

export const LANGUAGE_SECTION_CODE = `function LanguageSection() {
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
}`;

export const SETTINGS_STUB_SECTION_SIG = `function StubSection({ section }: { section: Exclude<SectionId, "env" | "messaging" | "appearance" | "notifications" | "language"> }) {`;
