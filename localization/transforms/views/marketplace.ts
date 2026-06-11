import { injectNamedImport, replaceOne } from "../../utils/string.js";
import {
	MARKETPLACE_TITLE,
	MARKETPLACE_SEARCH_PLACEHOLDER,
	MARKETPLACE_CATALOG_LOADING,
	MARKETPLACE_NO_MATCHES,
	MARKETPLACE_CATALOG_LABEL,
	MARKETPLACE_REFRESH_TITLE,
	MARKETPLACE_ADD_TITLE,
	MARKETPLACE_ALL_MARKETPLACES,
	MARKETPLACE_NO_MARKETPLACES,
	MARKETPLACE_NO_MARKETPLACES_HINT,
	MARKETPLACE_SUGGESTED,
	MARKETPLACE_PLUGIN_DETAILS,
	MARKETPLACE_PLUGIN_DETAILS_HINT,
	MARKETPLACE_ADD_MARKETPLACE_MODAL_TITLE,
	MARKETPLACE_UNINSTALL_TITLE,
	MARKETPLACE_ALL_LABEL,
	MARKETPLACE_INSTALLED_LABEL,
	MARKETPLACE_AVAILABLE_LABEL,
	MARKETPLACE_SOURCES_LABEL,
	MARKETPLACE_ADD_BTN,
	MARKETPLACE_INSPECTOR_HOOK,
	MARKETPLACE_SIDEBAR_HOOK,
	MARKETPLACE_VIEW_HOOK,
	MARKETPLACE_LOADING,
	MARKETPLACE_INSTALLED_BADGE,
	ADD_MARKETPLACE_MODAL_HOOK,
	ENTRY_CARD_HOOK,
	EMPTY_SOURCES_HOOK,
} from "../../translations.js";

export function localizeMarketplaceView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	// ── MarketplaceView hook
	next = replaceOne(
		next,
		/export function MarketplaceView\(\) \{\s*const \[data, setData\] = useState<ListMarketplaceResponse \| null>\(null\);/,
		`export function MarketplaceView() {
	const { t } = useTranslation();
	const [data, setData] = useState<ListMarketplaceResponse | null>(null);`,
		"MarketplaceView: inject hook",
	);
	// ── MarketplaceSidebar hook
	next = replaceOne(
		next,
/function MarketplaceSidebar\(\{[\s\S]*?\}\) \{/,
		`function MarketplaceSidebar({
	sources,
	counts,
	scope,
	onScope,
	marketplaceFilter,
	onMarketplaceFilter,
	onAdd,
	onRefresh,
	refreshing,
	onRemoveSource,
}: {
	sources: MarketplaceSource[];
	counts: { all: number; installed: number; available: number };
	scope: ScopeFilter;
	onScope: (s: ScopeFilter) => void;
	marketplaceFilter: string | "all";
	onMarketplaceFilter: (s: string | "all") => void;
	onAdd: () => void;
	onRefresh: () => void;
	refreshing: boolean;
	onRemoveSource: (name: string) => void;
}) {
	const { t } = useTranslation();
`,
		"MarketplaceView: inject MarketplaceSidebar hook",
	);
	// ── EmptySources hook
	next = replaceOne(
		next,
		/function EmptySources\(\{ onAdd, onAdded \}: \{ onAdd: \(\) => void; onAdded: \(\) => void \}\) \{/,
		`function EmptySources({ onAdd, onAdded }: { onAdd: () => void; onAdded: () => void }) {
	const { t } = useTranslation();`,
		"MarketplaceView: inject EmptySources hook",
	);
	// ── EntryCard hook
	next = replaceOne(
		next,
/function EntryCard\(\{[\s\S]*?\}\) \{/,
		`function EntryCard({
	entry,
	isSelected,
	busy,
	onSelect,
	onInstall,
	onUninstall,
}: {
	entry: MarketplaceCatalogEntry;
	isSelected: boolean;
	busy: boolean;
	onSelect: () => void;
	onInstall: () => void;
	onUninstall: () => void;
}) {
	const { t } = useTranslation();`,
		"MarketplaceView: inject EntryCard hook",
	);
	// ── MarketplaceInspector hook
	next = replaceOne(
		next,
		/function MarketplaceInspector\(\{ entry \}: \{ entry: MarketplaceCatalogEntry \| undefined \}\) \{/,
		`function MarketplaceInspector({ entry }: { entry: MarketplaceCatalogEntry | undefined }) {
	const { t } = useTranslation();`,
		"MarketplaceView: inject MarketplaceInspector hook",
	);
	// ── AddMarketplaceModalHost hook
	next = replaceOne(
		next,
		/export function AddMarketplaceModalHost\(\{ open, onClose, onAdded \}: \{ open: boolean; onClose: \(\) => void; onAdded: \(\) => void \}\) \{/,
		`export function AddMarketplaceModalHost({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: () => void }) {
	const { t } = useTranslation();`,
		"MarketplaceView: inject AddMarketplaceModalHost hook",
	);
	// ── Title and text replacements
	next = replaceOne(next, '<div className="meta">Marketplace</div>', MARKETPLACE_TITLE, "MarketplaceView: title");
	next = replaceOne(next, '"loading..."', `t("common.status.loading")`, "MarketplaceView: loading text");
	next = replaceOne(
		next,
		'placeholder="Search by name, tag, description"',
		MARKETPLACE_SEARCH_PLACEHOLDER,
		"MarketplaceView: search placeholder",
	);
	next = replaceOne(
		next,
		'<div className="px-3 py-6 text-center text-sm text-ink-3">Loading marketplace catalog...</div>',
		MARKETPLACE_CATALOG_LOADING,
		"MarketplaceView: catalog loading",
	);
	next = replaceOne(
		next,
		'No catalog entries match the current filters.',
		MARKETPLACE_NO_MATCHES,
		"MarketplaceView: no matches",
	);
	next = replaceOne(next, '<div className="meta">Catalog</div>', MARKETPLACE_CATALOG_LABEL, "MarketplaceView: catalog label");
	next = replaceOne(next, 'title="Refresh marketplaces"', MARKETPLACE_REFRESH_TITLE, "MarketplaceView: refresh title");
	next = replaceOne(next, 'title="Add marketplace"', MARKETPLACE_ADD_TITLE, "MarketplaceView: add title");
	next = replaceOne(next, '<span className="truncate">All marketplaces</span>', MARKETPLACE_ALL_MARKETPLACES, "MarketplaceView: all marketplaces");
	next = replaceOne(next, '<div className="meta">No marketplaces yet</div>', MARKETPLACE_NO_MARKETPLACES, "MarketplaceView: no marketplaces");
	next = replaceOne(
		next,
		'Add a marketplace catalog (GitHub repo, git URL, or local path) to browse and install plugins.',
		MARKETPLACE_NO_MARKETPLACES_HINT,
		"MarketplaceView: no marketplaces hint",
	);
	next = replaceOne(next, '<div className="meta">Suggested</div>', MARKETPLACE_SUGGESTED, "MarketplaceView: suggested");
	next = replaceOne(next, '<div className="meta">Plugin details</div>', MARKETPLACE_PLUGIN_DETAILS, "MarketplaceView: plugin details");
	next = replaceOne(next, '<p>Select a plugin to see its full metadata.</p>', MARKETPLACE_PLUGIN_DETAILS_HINT, "MarketplaceView: plugin details hint");
	next = replaceOne(next, '<div className="meta">Add marketplace</div>', MARKETPLACE_ADD_MARKETPLACE_MODAL_TITLE, "MarketplaceView: add modal title");
	next = replaceOne(next, 'title="Uninstall"', MARKETPLACE_UNINSTALL_TITLE, "MarketplaceView: uninstall title");
	next = replaceOne(next, 'label="All"', MARKETPLACE_ALL_LABEL, "MarketplaceView: all scope label");
	next = replaceOne(next, 'label="Installed"', MARKETPLACE_INSTALLED_LABEL, "MarketplaceView: installed scope label");
	next = replaceOne(next, 'label="Available"', MARKETPLACE_AVAILABLE_LABEL, "MarketplaceView: available scope label");
	next = replaceOne(next, '<div className="meta">Sources</div>', MARKETPLACE_SOURCES_LABEL, "MarketplaceView: sources label");
	next = replaceOne(next, 'label: "Anthropic official"', 'label: "Anthropic 官方"', "MarketplaceView: suggested label");
	next = replaceOne(
		next,
		'description: "Anthropic\'s first-party catalog. Curated plugins, commands, and skills — the SDK\'s recommended starter."',
		'description: "Anthropic 的第一方目录，包含精选插件、命令和技能，也是 SDK 推荐的起步选择。"',
		"MarketplaceView: suggested description",
	);
	next = replaceOne(
		next,
		/>\s*Add custom marketplace\s*</,
		">添加自定义市场<",
		"MarketplaceView: add custom marketplace",
	);
	next = replaceOne(
		next,
		'<Badge tone="success">installed</Badge>',
		'<Badge tone="success">{t("common.status.installed")}</Badge>',
		"MarketplaceView: installed badge",
	);
	next = replaceOne(
		next,
		/\n\s*Install\s*\n\s*<\/button>/,
		'\n\t\t\t\t\t\t\t{t("common.actions.install")}\n\t\t\t\t\t\t</button>',
		"MarketplaceView: install button",
	);
	next = replaceOne(next, 'title={`Remove ${source.name}`}', 'title={`移除 ${source.name}`}', "MarketplaceView: remove source title");
	next = replaceOne(
		next,
		'<div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-mono text-xs text-success">\n\t\t\t\t\tAdded {addedName}. Refresh below to fetch its catalog.\n\t\t\t\t</div>',
		`<div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-mono text-xs text-success">
					已添加 {addedName}。请在下方刷新以拉取目录。
				</div>`,
		"MarketplaceView: added hint",
	);
	return next;
}
