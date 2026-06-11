import { injectNamedImport, replaceOne } from "../../utils/string.js";

export function localizeKbView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	// ── KbView hook
	next = replaceOne(
		next,
		/export function KbView\(\) \{\s*const \[params, setParams\] = useSearchParams\(\);/,
		`export function KbView() {
	const { t } = useTranslation();
	const [params, setParams] = useSearchParams();`,
		"KbView: inject hook",
	);
	// ── KbTopBar hook
	next = replaceOne(
		next,
/function KbTopBar\(\{[\s\S]*?\}\) \{/,
		`function KbTopBar({
	currentPath,
	mobileDetailOpen,
	viewMode,
	onViewMode,
	onBack,
}: {
	currentPath: string | undefined;
	mobileDetailOpen: boolean;
	viewMode: "file" | "graph";
	onViewMode: (v: "file" | "graph") => void;
	onBack: () => void;
}) {
	const { t } = useTranslation();
`,
		"KbView: inject KbTopBar hook",
	);
	// ── KbSidebar hook
	next = replaceOne(
		next,
		/function KbSidebar\(\) \{\s*return \(/,
		`function KbSidebar() {
	const { t } = useTranslation();
	return (`,
		"KbView: inject KbSidebar hook",
	);
	// ── KbEmpty hook
	next = replaceOne(
		next,
		/function KbEmpty\(\) \{\s*return \(/,
		`function KbEmpty() {
	const { t } = useTranslation();
	return (`,
		"KbView: inject KbEmpty hook",
	);
	// ── GraphPreviewEmpty hook
	next = replaceOne(
		next,
		/function GraphPreviewEmpty\(\) \{\s*return \(/,
		`function GraphPreviewEmpty() {
	const { t } = useTranslation();
	return (`,
		"KbView: inject GraphPreviewEmpty hook",
	);
	// ── KbWelcome hook
	next = replaceOne(
		next,
/function KbWelcome\(\{[\s\S]*?\}\) \{/,
		`function KbWelcome({
	status,
	onInitialized,
}: {
	status: KbStatusResponse;
	onInitialized: () => void;
}) {
	const { t } = useTranslation();`,
		"KbView: inject KbWelcome hook",
	);
	// ── KbInspector hook
	next = replaceOne(
		next,
/function KbInspector\(\{[\s\S]*?\}\) \{/,
		`function KbInspector({
	currentPath,
	onNavigate,
	kbChangeCounter,
}: {
	currentPath: string | undefined;
	onNavigate: (p: string) => void;
	kbChangeCounter: number;
}) {
	const { t } = useTranslation();`,
		"KbView: inject KbInspector hook",
	);
	// ── Title and text replacements
	next = replaceOne(next, '<div className="meta">Knowledge</div>', `<div className="meta">{t("kb.title")}</div>`, "KbView: title");
	next = replaceOne(next, '<div className="meta">Knowledge</div>', `<div className="meta">{t("kb.title")}</div>`, "KbView: sidebar title");
	next = replaceOne(next, 'aria-label="Back to tree"', `aria-label={t("kb.backToTree")}`, "KbView: back to tree aria");
	next = replaceOne(next, 'title="File viewer (?view=file)"', `title={t("kb.fileViewer")}`, "KbView: file viewer title");
	next = replaceOne(next, 'title="Force-directed graph (?view=graph)"', `title={t("kb.graphViewer")}`, "KbView: graph viewer title");
	next = replaceOne(next, />\s*File\s*</, `>{t("kb.file")}<`, "KbView: file tab");
	next = replaceOne(next, />\s*Graph\s*</, `>{t("kb.graph")}<`, "KbView: graph tab");
	next = replaceOne(
		next,
		'<div className="mt-3 text-sm text-ink-2">Pick a file from the tree.</div>',
		`<div className="mt-3 text-sm text-ink-2">{t("kb.pickFile")}</div>`,
		"KbView: empty pick file",
	);
	next = replaceOne(
		next,
		'<div className="mt-3 text-sm text-ink-2">Click a node</div>',
		`<div className="mt-3 text-sm text-ink-2">{t("kb.clickNode")}</div>`,
		"KbView: graph empty click node",
	);
	next = replaceOne(
		next,
		/<h1 className="text-base font-medium text-ink">Set up your knowledge base<\/h1>/,
		`<h1 className="text-base font-medium text-ink">{t("kb.setupTitle")}</h1>`,
		"KbView: welcome title",
	);
	next = replaceOne(
		next,
		/Create starter README/,
		`{t("kb.createStarter")}`,
		"KbView: create starter btn",
	);
	next = replaceOne(
		next,
		/Or set <span className="font-mono text-ink-2">OMP_DECK_KB_ROOT<\/span> and restart the deck\./,
		`{t("kb.orSetEnv")}`,
		"KbView: or set env text",
	);
	next = replaceOne(
		next,
		/<div className="meta">Inspector<\/div>/,
		`<div className="meta">{t("kb.inspector")}</div>`,
		"KbView: inspector meta",
	);
	next = replaceOne(
		next,
		/Pick a file to inspect\./,
		`<div className="text-sm text-ink-2">{t("kb.pickFileInspect")}</div>`,
		"KbView: pick file inspect",
	);
	next = replaceOne(next, 'aria-label="Search KB (Ctrl-P)"', 'aria-label="搜索知识库 (Ctrl-P)"', "KbView: search aria");
	next = replaceOne(next, 'title="Search (Ctrl-P / ⌘P)"', 'title="搜索 (Ctrl-P / ⌘P)"', "KbView: search title");
	next = replaceOne(
		next,
		'Your Karpathy-style llm-wiki. Click a file to open; wikilinks navigate in-app.',
		'你的 Karpathy 风格 llm-wiki。点击文件即可打开；wikilink 会在应用内跳转。',
		"KbView: sidebar hint",
	);
	next = replaceOne(next, 'window.confirm("Discard unsaved changes?")', 'window.confirm("放弃未保存的更改？")', "KbView: discard confirm");
	next = replaceOne(next, 'title="Save (Ctrl-S)"', 'title="保存 (Ctrl-S)"', "KbView: save title");
	next = replaceOne(
		next,
		/\n\s*Save\s*\n\s*<\/button>/,
		"\n\t\t\t\t\t\t\t保存\n\t\t\t\t\t\t\t</button>",
		"KbView: save label",
	);
	next = replaceOne(next, 'title="Discard (Esc)"', 'title="放弃更改 (Esc)"', "KbView: discard title");
	next = replaceOne(
		next,
		/\n\s*Cancel\s*\n\s*<\/button>/,
		"\n\t\t\t\t\t\t\t取消\n\t\t\t\t\t\t\t</button>",
		"KbView: cancel label",
	);
	next = replaceOne(next, 'title="Edit (or click anywhere in the body)"', 'title="编辑（或点击正文任意位置）"', "KbView: edit title");
	next = replaceOne(
		next,
		/\n\s*Edit\s*\n\s*<\/button>/,
		"\n\t\t\t\t\t\t\t编辑\n\t\t\t\t\t\t\t</button>",
		"KbView: edit label",
	);
	next = replaceOne(next, 'title="Close preview"', 'title="关闭预览"', "KbView: close preview title");
	next = replaceOne(next, 'aria-label="Close preview"', 'aria-label="关闭预览"', "KbView: close preview aria");
	next = replaceOne(next, 'window.alert("Path must end in .md");', 'window.alert("路径必须以 .md 结尾");', "KbView: path must end in md");
	next = replaceOne(
		next,
		'<Loader2 className="mr-1 inline-block h-3 w-3 animate-spin" /> loading backlinks…',
		'<Loader2 className="mr-1 inline-block h-3 w-3 animate-spin" /> 正在加载反向链接…',
		"KbView: loading backlinks",
	);
	next = replaceOne(next, '>no backlinks<', '>无反向链接<', "KbView: no backlinks");
	next = replaceOne(next, 'backlinks ({backlinks.length})', '反向链接 ({backlinks.length})', "KbView: backlinks count");
	next = replaceOne(next, '>tags<', '>标签<', "KbView: tags label");
	next = replaceOne(next, 'title="Click-to-filter lands in T-40"', 'title="点击筛选会跳转到 T-40"', "KbView: tag filter hint");
	return next;
}
