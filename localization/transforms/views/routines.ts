import { injectNamedImport, replaceOne } from "../../utils/string.js";
import {
	ROUTINES_VIEW_HOOK,
	ROUTINES_INDEX_HOOK,
	ROUTINE_LIST_ITEM_HOOK,
	ROUTINES_SIDEBAR_HOOK,
	EDITOR_SIDEBAR_HOOK,
	INDEX_INSPECTOR_HOOK,
	ROUTINES_TITLE,
	ROUTINES_SUMMARY,
	ROUTINES_NEW_ROUTINE,
	ROUTINES_LOADING,
	ROUTINES_NO_ROUTINES,
	ROUTINES_NO_ROUTINES_HINT,
	ROUTINES_LOADING_ROUTINE,
	ROUTINES_PIPELINE_CHIP,
	ROUTINES_STEPS,
	ROUTINES_PERCENT_OK,
	ROUTINES_MANUAL,
	ROUTINES_NEXT,
	ROUTINES_LAST,
	ROUTINES_RUN_BTN,
	ROUTINES_RUN_NOW_TITLE,
	ROUTINES_ON_OFF,
	ROUTINES_ENABLE_DISABLE_TITLE,
	ROUTINES_SCHEDULE_LABEL,
	ROUTINES_STAT_ENABLED,
	ROUTINES_STAT_DISABLED,
	ROUTINES_STAT_PIPELINES,
	ROUTINES_TEMPLATES_LABEL,
	ROUTINES_TEMPLATES_LOADING,
	ROUTINES_NO_TEMPLATES,
	ROUTINES_TEMPLATE_MAP,
	ROUTINES_TEMPLATE_STEPS_TRIGGERS,
	ROUTINES_CRON_LABEL,
	ROUTINES_ALL_ROUTINES,
	ROUTINES_EDITOR_LABEL,
	ROUTINES_EDITOR_NOTE,
	ROUTINES_OVERVIEW_LABEL,
	ROUTINES_TOTAL_ROUTINES,
	ROUTINES_RUNS_RECORDED,
	ROUTINES_NEXT_FIRE_LABEL,
	ROUTINES_NO_ENABLED_SCHEDULES,
} from "../../translations.js";

export function localizeRoutinesView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");

	// ── RoutinesView hook
	next = replaceOne(
		next,
		/export function RoutinesView\(\) \{\s*const \[params, setParams\] = useSearchParams\(\);/,
		ROUTINES_VIEW_HOOK,
		"RoutinesView: inject hook",
	);

	// ── RoutinesIndex hook
	next = replaceOne(
		next,
		/function RoutinesIndex\(\{\s*routines,\s*metrics,\s*loading,\s*error,\s*onNew,\s*onOpen,\s*onToggleEnabled,\s*onRunNow,\s*\}: \{\s*routines: Routine\[\];\s*metrics: Record<string, RoutineMetrics>;\s*loading: boolean;\s*error: string \| undefined;\s*onNew: \(\) => void;\s*onOpen: \(r: Routine\) => void;\s*onToggleEnabled: \(r: Routine\) => void;\s*onRunNow: \(r: Routine\) => void;\s*\}\) \{/,
		ROUTINES_INDEX_HOOK,
		"RoutinesIndex: inject hook",
	);

	// ── RoutineListItem hook
	next = replaceOne(
		next,
		/function RoutineListItem\(\{\s*routine,\s*metrics,\s*onOpen,\s*onToggleEnabled,\s*onRunNow,\s*\}: \{\s*routine: Routine;\s*metrics: RoutineMetrics \| undefined;\s*onOpen: \(r: Routine\) => void;\s*onToggleEnabled: \(r: Routine\) => void;\s*onRunNow: \(r: Routine\) => void;\s*\}\) \{/,
		ROUTINE_LIST_ITEM_HOOK,
		"RoutineListItem: inject hook",
	);

	// ── RoutinesSidebar hook
	next = replaceOne(
		next,
		/function RoutinesSidebar\(\{\s*routines,\s*onNew,\s*onInstallTemplate,\s*\}: \{\s*routines: Routine\[\];\s*onNew: \(\) => void;\s*onInstallTemplate: \(slug: string\) => void;\s*\}\) \{/,
		ROUTINES_SIDEBAR_HOOK,
		"RoutinesSidebar: inject hook",
	);

	// ── EditorSidebar hook
	next = replaceOne(
		next,
		/function EditorSidebar\(\{ onBack, onNew \}: \{ onBack: \(\) => void; onNew: \(\) => void \}\) \{/,
		EDITOR_SIDEBAR_HOOK,
		"EditorSidebar: inject hook",
	);

	// ── IndexInspector hook
	next = replaceOne(
		next,
		/function IndexInspector\(\{ routines, metrics \}: \{ routines: Routine\[\]; metrics: Record<string, RoutineMetrics> \}\) \{/,
		INDEX_INSPECTOR_HOOK,
		"IndexInspector: inject hook",
	);

	// ── RoutinesIndex strings
	next = replaceOne(next, '<div className="meta">Routines</div>', ROUTINES_TITLE, "RoutinesIndex: title");
	next = replaceOne(
		next,
		/\{routines\.length\} total · \{routines\.filter\(\(r\) => r\.enabled\)\.length\} enabled · \{routines\.filter\(\(r\) => r\.specVersion === 1\)\.length\} pipelines/,
		ROUTINES_SUMMARY,
		"RoutinesIndex: summary",
	);
	next = replaceOne(next, />\s*New routine\s*</, ROUTINES_NEW_ROUTINE, "RoutinesIndex: new routine btn");
	next = replaceOne(
		next,
		/<div className="flex flex-1 items-center justify-center text-sm text-ink-3">Loading\.\.\.<\/div>/,
		ROUTINES_LOADING,
		"RoutinesIndex: loading",
	);
	next = replaceOne(next, '<div className="meta mb-1.5">No routines yet</div>', ROUTINES_NO_ROUTINES, "RoutinesIndex: no routines");
	next = replaceOne(
		next,
		/<p className="text-sm text-ink-2">Create a pipeline or install the daily briefing template\.<\/p>/,
		ROUTINES_NO_ROUTINES_HINT,
		"RoutinesIndex: no routines hint",
	);

	// ── RoutinesView: loading routine
	next = replaceOne(
		next,
		/<div className="flex h-full items-center justify-center px-6 text-center font-mono text-2xs text-ink-3">\s*Loading routine\.\.\.\s*<\/div>/,
		ROUTINES_LOADING_ROUTINE,
		"RoutinesView: loading routine",
	);

	// ── RoutineListItem strings
	next = replaceOne(
		next,
		/\{routine\.specVersion === 1 \? "pipeline" : routine\.actionKind\}/,
		ROUTINES_PIPELINE_CHIP,
		"RoutineListItem: pipeline chip",
	);
	next = replaceOne(next, /\{stepCount\} steps/, ROUTINES_STEPS, "RoutineListItem: steps");
	next = replaceOne(next, /\{okPct\}% ok/, ROUTINES_PERCENT_OK, "RoutineListItem: percent ok");
	next = replaceOne(
		next,
		/\{routine\.cron \? <span>\{routine\.cron\}<\/span> : <span>manual<\/span>\}/,
		ROUTINES_MANUAL,
		"RoutineListItem: manual",
	);
	next = replaceOne(
		next,
		/\{routine\.nextRunAt \? <span>next \{new Date\(routine\.nextRunAt\)\.toLocaleString\(\)\}<\/span> : null\}/,
		ROUTINES_NEXT,
		"RoutineListItem: next",
	);
	next = replaceOne(
		next,
		/\{routine\.lastRunAt \? <span>last \{new Date\(routine\.lastRunAt\)\.toLocaleString\(\)\}<\/span> : null\}/,
		ROUTINES_LAST,
		"RoutineListItem: last",
	);
	next = replaceOne(next, />\s*Run\s*</, ROUTINES_RUN_BTN, "RoutineListItem: run btn");
	next = replaceOne(next, 'title="Run now"', ROUTINES_RUN_NOW_TITLE, "RoutineListItem: run now title");
	next = replaceOne(
		next,
		/\{routine\.enabled \? "On" : "Off"\}/,
		ROUTINES_ON_OFF,
		"RoutineListItem: on/off",
	);
	next = replaceOne(
		next,
		/title=\{routine\.enabled \? "Disable" : "Enable"\}/,
		ROUTINES_ENABLE_DISABLE_TITLE,
		"RoutineListItem: enable/disable title",
	);

	// ── RoutinesSidebar strings
	next = replaceOne(next, '<div className="meta mb-1.5">Schedule</div>', ROUTINES_SCHEDULE_LABEL, "RoutinesSidebar: schedule label");
	next = replaceOne(next, 'label="enabled"', ROUTINES_STAT_ENABLED, "RoutinesSidebar: stat enabled");
	next = replaceOne(next, 'label="disabled"', ROUTINES_STAT_DISABLED, "RoutinesSidebar: stat disabled");
	next = replaceOne(next, 'label="pipelines"', ROUTINES_STAT_PIPELINES, "RoutinesSidebar: stat pipelines");
	next = replaceOne(next, '<div className="meta mb-1.5">Templates</div>', ROUTINES_TEMPLATES_LABEL, "RoutinesSidebar: templates label");
	next = replaceOne(
		next,
		/<div className="font-mono text-2xs text-ink-3">Loading\.\.\.<\/div>/,
		ROUTINES_TEMPLATES_LOADING,
		"RoutinesSidebar: templates loading",
	);
	next = replaceOne(next, '<div className="font-mono text-2xs text-ink-3">No templates.</div>', ROUTINES_NO_TEMPLATES, "RoutinesSidebar: no templates");

	// Rename template map callback param `t` → `tpl` to avoid shadowing i18n `t`
	next = replaceOne(next, "templates.map((t) => (", ROUTINES_TEMPLATE_MAP, "RoutinesSidebar: template map rename t→tpl");
	next = replaceOne(next, /t\.slug/g, "tpl.slug", "RoutinesSidebar: tpl.slug");
	next = replaceOne(next, /t\.name/g, "tpl.name", "RoutinesSidebar: tpl.name");
	next = replaceOne(next, /t\.description/g, "tpl.description", "RoutinesSidebar: tpl.description");
	next = replaceOne(
		next,
		/\{t\.steps\} steps · \{t\.triggers\} triggers/,
		ROUTINES_TEMPLATE_STEPS_TRIGGERS,
		"RoutinesSidebar: template steps/triggers",
	);

	next = replaceOne(next, '<div className="meta mb-1.5">Cron format</div>', ROUTINES_CRON_LABEL, "RoutinesSidebar: cron label");

	// ── EditorSidebar strings
	next = replaceOne(next, />\s*All routines\s*</, ROUTINES_ALL_ROUTINES, "EditorSidebar: all routines");
	next = replaceOne(next, '<div className="meta mb-1.5">Editor</div>', ROUTINES_EDITOR_LABEL, "EditorSidebar: editor label");
	next = replaceOne(
		next,
		/<p className="text-xs leading-relaxed text-ink-3">\s*The builder now uses the main canvas\. Use the right inspector for runs and actions\.\s*<\/p>/,
		ROUTINES_EDITOR_NOTE,
		"EditorSidebar: editor note",
	);

	// ── IndexInspector strings
	next = replaceOne(next, '<div className="meta mb-2">Overview</div>', ROUTINES_OVERVIEW_LABEL, "IndexInspector: overview label");
	next = replaceOne(next, "<span>Total routines</span>", ROUTINES_TOTAL_ROUTINES, "IndexInspector: total routines");
	next = replaceOne(next, "<span>Runs recorded</span>", ROUTINES_RUNS_RECORDED, "IndexInspector: runs recorded");
	next = replaceOne(next, '<div className="meta mb-2">Next fire</div>', ROUTINES_NEXT_FIRE_LABEL, "IndexInspector: next fire label");
	next = replaceOne(
		next,
		/<div className="font-mono text-2xs text-ink-3">No enabled scheduled routines\.<\/div>/,
		ROUTINES_NO_ENABLED_SCHEDULES,
		"IndexInspector: no enabled schedules",
	);

	return next;
}
