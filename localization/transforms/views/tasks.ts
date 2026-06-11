import { injectNamedImport, replaceOne } from "../../utils/string.js";
import {
	TASKS_HOOK,
	TASKS_TITLE,
	TASKS_TASK_COUNT,
	TASKS_EDIT_COLUMNS_TITLE,
	TASKS_COLUMNS_BTN,
	TASKS_LOADING,
	TASKS_NO_COLUMNS,
	TASKS_EMPTY_INSPECTOR_HOOK,
	TASKS_EMPTY_INSPECTOR_TEXT,
	TASKS_SIDEBAR_HOOK,
	TASKS_OVERVIEW,
	TASKS_TIPS,
	TASKS_TIP1,
	TASKS_TIP2,
	TASKS_TIP3,
} from "../../translations.js";

export function localizeTasksView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	next = replaceOne(
		next,
		/export function TasksView\(\) \{\s*const navigate = useNavigate\(\);/,
		TASKS_HOOK,
		"TasksView: inject translation hook",
	);
	next = replaceOne(next, '<div className="meta">Kanban</div>', TASKS_TITLE, "TasksView: title");
	next = replaceOne(
		next,
		/\{tasks\.length\} task\{tasks\.length === 1 \? "" : "s"\} · \{states\.length\} columns/,
		TASKS_TASK_COUNT,
		"TasksView: task/column count",
	);
	next = replaceOne(next, 'title="Edit columns"', TASKS_EDIT_COLUMNS_TITLE, "TasksView: edit columns title");
	next = replaceOne(next, />\s*Columns\s*</, TASKS_COLUMNS_BTN, "TasksView: columns button");
	next = replaceOne(next, />\s*Loading…\s*</, TASKS_LOADING, "TasksView: loading");
	next = replaceOne(
		next,
		/>\s*No columns\. Open the column editor to add one\.\s*</,
		TASKS_NO_COLUMNS,
		"TasksView: no columns",
	);
	next = replaceOne(
		next,
		/function EmptyInspector\(\) \{\s*return \(/,
		TASKS_EMPTY_INSPECTOR_HOOK,
		"TasksView: inject EmptyInspector translation hook",
	);
	next = replaceOne(
		next,
		/>\s*Click a task to edit, or the Columns button to configure states\.\s*</,
		TASKS_EMPTY_INSPECTOR_TEXT,
		"TasksView: empty inspector text",
	);
	next = replaceOne(
		next,
		/function TasksSidebar\(\{ tasks, states \}: \{ tasks: Task\[\]; states: TaskState\[\] \}\) \{\s*return \(/,
		TASKS_SIDEBAR_HOOK,
		"TasksView: inject TasksSidebar translation hook",
	);
	next = replaceOne(next, '<div className="meta mb-1.5">Overview</div>', TASKS_OVERVIEW, "TasksView: overview");
	next = replaceOne(next, '<div className="meta mb-1.5">Tips</div>', TASKS_TIPS, "TasksView: tips");
	next = replaceOne(next, "<li>Drag cards between columns to change state</li>", TASKS_TIP1, "TasksView: tip1");
	next = replaceOne(next, "<li>Click a column name to edit it</li>", TASKS_TIP2, "TasksView: tip2");
	next = replaceOne(next, "<li>Open in chat sends the task as the first prompt</li>", TASKS_TIP3, "TasksView: tip3");
	return next;
}
