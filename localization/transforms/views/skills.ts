import { injectNamedImport, replaceOne } from "../../utils/string.js";

export function localizeSkillsView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	// ── SkillsView hook
	next = replaceOne(
		next,
		/export function SkillsView\(\) \{\s*const \[data, setData\] = useState<ListSkillsResponse \| null>\(null\);/,
		`export function SkillsView() {
	const { t } = useTranslation();
	const [data, setData] = useState<ListSkillsResponse | null>(null);`,
		"SkillsView: inject hook",
	);
	// ── SkillDetailPane hook
	next = replaceOne(
		next,
		/function SkillDetailPane\(\{[\s\S]*?\}\) \{/,
		`function SkillDetailPane({
	skill,
	detail,
	loading,
	error,
	onBack,
}: {
	skill: SkillSummary;
	detail: SkillDetailResponse | null;
	loading: boolean;
	error: string | undefined;
	onBack?: () => void;
}) {
	const { t } = useTranslation();`,
		"SkillsView: inject SkillDetailPane hook",
	);
	// ── EmptyState hook
	next = replaceOne(
		next,
		/function EmptyState\(\{ total \}: \{ total: number \}\) \{\s*return \(/,
		`function EmptyState({ total }: { total: number }) {
	const { t } = useTranslation();
	return (`,
		"SkillsView: inject EmptyState hook",
	);
	// ── SkillsSidebar hook
	next = replaceOne(
		next,
/function SkillsSidebar\(\{[\s\S]*?\}\) \{/,
		`function SkillsSidebar({
	skills,
	providerFilter,
	onProviderFilter,
	levelFilter,
	onLevelFilter,
}: {
	skills: SkillSummary[];
	providerFilter: string | "all";
	onProviderFilter: (p: string | "all") => void;
	levelFilter: LevelFilter;
	onLevelFilter: (l: LevelFilter) => void;
}) {
	const { t } = useTranslation();`,
		"SkillsView: inject SkillsSidebar hook",
	);
	// ── SkillInspector hook
	next = replaceOne(
		next,
/function SkillInspector\(\{[\s\S]*?\}\) \{/,
		`function SkillInspector({
	skill,
	detail,
}: {
	skill: SkillSummary | undefined;
	detail: SkillDetailResponse | null;
}) {
	const { t } = useTranslation();`,
		"SkillsView: inject SkillInspector hook",
	);
	// ── Title and text replacements
	next = replaceOne(next, '<div className="meta">Skills</div>', `<div className="meta">{t("skills.title")}</div>`, "SkillsView: title header");
	next = replaceOne(
		next,
		'placeholder="Search name, description, triggers, tags"',
		`placeholder={t("skills.searchPlaceholder")}`,
		"SkillsView: search placeholder",
	);
	next = replaceOne(
		next,
		'<div className="px-3 py-6 text-center text-sm text-ink-3">Loading skills...</div>',
		`<div className="px-3 py-6 text-center text-sm text-ink-3">{t("common.status.loading")}</div>`,
		"SkillsView: loading skills",
	);
	// EmptyState text
	next = replaceOne(
		next,
		'{total === 0 ? "No skills discovered" : "No skills match the current filters"}',
		`{total === 0 ? t("skills.noSkills") : t("skills.noMatches")}`,
		"SkillsView: empty state text",
	);
	next = replaceOne(
		next,
		'{total === 0\n\t\t\t\t\t? "Drop a SKILL.md into ~/.omp/agent/skills/<name>/, or install a marketplace plugin."\n\t\t\t\t\t: "Try clearing the source / level filters or the search box."}',
		`{total === 0
					? t("skills.noSkillsHint")
					: t("skills.noMatchesHint")}`,
		"SkillsView: empty state hint",
	);
	// SkillDetailPane text
	next = replaceOne(next, 'aria-label="Back to skill list"', `aria-label={t("skills.backToList")}`, "SkillsView: back aria");
	next = replaceOne(next, '<span className="text-ink-4">from plugin</span>', `<span className="text-ink-4">{t("skills.fromPlugin")}</span>`, "SkillsView: from plugin label");
	next = replaceOne(
		next,
		'<div className="flex items-center gap-2 px-4 py-3 text-sm text-ink-3">\n\t\t\t\t\t<Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading SKILL.md...\n\t\t\t\t</div>',
		`<div className="flex items-center gap-2 px-4 py-3 text-sm text-ink-3">
					<Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("common.status.loading")}
				</div>`,
		"SkillsView: detail loading",
	);
	// SkillsSidebar: Source and Level labels
	next = replaceOne(next, '<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">Source</div>', `<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">{t("skills.source")}</div>`, "SkillsView: source label");
	next = replaceOne(next, '<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">Level</div>', `<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">{t("skills.level")}</div>`, "SkillsView: level label");
	// SkillInspector text
	next = replaceOne(next, '<div className="meta">Inspector</div>', `<div className="meta">{t("skills.inspector")}</div>`, "SkillsView: inspector meta");
	next = replaceOne(
		next,
		'<div className="mt-0.5 text-xs text-ink-3">SKILL.md frontmatter + co-located files.</div>',
		`<div className="mt-0.5 text-xs text-ink-3">{t("skills.inspectorHint")}</div>`,
		"SkillsView: inspector hint",
	);
	next = replaceOne(
		next,
		'<div className="px-3 py-4 text-xs text-ink-3">Pick a skill to inspect.</div>',
		`<div className="px-3 py-4 text-xs text-ink-3">{t("skills.pickSkill")}</div>`,
		"SkillsView: pick skill",
	);
	next = replaceOne(
		next,
		'{skill.enabled ? "yes" : "hidden (frontmatter)"}',
		`{skill.enabled ? t("skills.enabledYes") : t("skills.enabledHidden")}`,
		"SkillsView: enabled values",
	);
	next = replaceOne(
		next,
		/<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">\s*Bundled files/,
		`<div className="font-mono text-2xs uppercase tracking-meta text-ink-4">
						{t("skills.bundledFiles")}`,
		"SkillsView: bundled files label",
	);
	next = replaceOne(
		next,
		/<div className="mt-1 text-2xs text-ink-4">\s*Reachable on demand — not auto-injected into the agent's context\.\s*<\/div>/,
		`<div className="mt-1 text-2xs text-ink-4">
							{t("skills.reachableOnDemand")}
						</div>`,
		"SkillsView: reachable hint",
	);
	return next;
}
