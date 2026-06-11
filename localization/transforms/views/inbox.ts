import { injectNamedImport, replaceOne } from "../../utils/string.js";
import {
	INBOX_KIND_LABEL,
	INBOX_VIEW_HOOK,
	INBOX_HEADER_ALL,
	INBOX_LOADING,
	INBOX_EMPTY_ALL,
	INBOX_SIDEBAR_HOOK,
	INBOX_SIDEBAR_CAPTURE,
	INBOX_SIDEBAR_FILTER,
	INBOX_SIDEBAR_SHOW_PROCESSED,
	INBOX_SIDEBAR_KIND_LABEL,
	INBOX_LIST_ROW_HOOK,
	INBOX_LIST_ROW_ARIA,
	INBOX_READER_HOOK,
	INBOX_READER_MARK_LABEL,
	INBOX_READER_DELETE_LABEL,
	INBOX_READER_PROMOTE_LABEL,
	INBOX_READER_OPEN_IN_CHAT_HINT,
	INBOX_READER_OPEN_IN_CHAT,
	INBOX_READER_CLOSE_LABEL,
	INBOX_READER_UNTITLED,
	INBOX_READER_ADD_NOTES,
	INBOX_READER_KIND_OPTION,
	INBOX_COMPOSE_HOOK,
	INBOX_COMPOSE_KIND_OPTION,
	INBOX_COMPOSE_CANCEL,
	INBOX_COMPOSE_CAPTURE,
	INBOX_COMPOSE_TITLE_PLACEHOLDER,
	INBOX_COMPOSE_SAVE_HINT,
	INBOX_COMPOSE_BODY_PLACEHOLDER,
	INBOX_EMPTY_READER_HOOK,
	INBOX_EMPTY_READER_DETAIL,
	INBOX_EMPTY_READER_CAPTURE,
} from "../../translations.js";

export function localizeInboxView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");

	// Replace KIND_LABEL values with i18n keys
	next = replaceOne(
		next,
		/const KIND_LABEL: Record<InboxKind, string> = \{[\s\S]*?\};/,
		INBOX_KIND_LABEL,
		"InboxView: KIND_LABEL i18n keys",
	);

	// ── InboxView hook ──
	next = replaceOne(
		next,
		/export function InboxView\(\) \{\s*const setInspectorOpen = useStore\(\(s\) => s\.setInspectorOpen\);/,
		INBOX_VIEW_HOOK,
		"InboxView: inject hook",
	);

	// Header: "All inbox" / KIND_LABEL[filter]
	next = replaceOne(
		next,
		/\{filter === "all" \? "All inbox" : KIND_LABEL\[filter\]\}/,
		INBOX_HEADER_ALL,
		"InboxView: header title",
	);

	// Loading state
	next = replaceOne(next, "<EmptyHint>Loading…</EmptyHint>", INBOX_LOADING, "InboxView: loading");

	// Empty state
	next = replaceOne(
		next,
		/\{filter === "all" \? "Inbox is empty\." : `No \$\{KIND_LABEL\[filter\]\}\.`\}/,
		INBOX_EMPTY_ALL,
		"InboxView: empty state",
	);

	// ── InboxSidebar hook ──
	next = replaceOne(
		next,
		/function InboxSidebar\(\{\s*counts,\s*filter,\s*setFilter,\s*includeProcessed,\s*setIncludeProcessed,\s*onCompose,\s*\}: \{\s*counts: Record<string, number>;\s*filter: Filter;\s*setFilter: \(f: Filter\) => void;\s*includeProcessed: boolean;\s*setIncludeProcessed: \(v: boolean\) => void;\s*onCompose: \(\) => void;\s*\}\) \{/,
		INBOX_SIDEBAR_HOOK,
		"InboxView: inject InboxSidebar hook",
	);

	next = replaceOne(next, />\s*Capture\s*</, INBOX_SIDEBAR_CAPTURE, "InboxView: sidebar capture button");

	// Sidebar Filter label
	next = replaceOne(next, '<div className="meta mb-1.5">Filter</div>', INBOX_SIDEBAR_FILTER, "InboxView: filter label");


	// Sidebar Show processed
	next = replaceOne(next, "<span>Show processed</span>", INBOX_SIDEBAR_SHOW_PROCESSED, "InboxView: show processed");
	// Sidebar kind label
	next = replaceOne(next, 'label={KIND_LABEL[k]}', INBOX_SIDEBAR_KIND_LABEL, "InboxView: sidebar kind label");

	// ── ListRow hook ──
	next = replaceOne(
		next,
		/function ListRow\(\{\s*item,\s*active,\s*onClick,\s*\}: \{\s*item: InboxItem;\s*active: boolean;\s*onClick: \(\) => void;\s*\}\) \{/,
		INBOX_LIST_ROW_HOOK,
		"InboxView: inject ListRow hook",
	);

	// ListRow aria-label processed/unprocessed
	next = replaceOne(
		next,
		'aria-label={item.processedAt ? "processed" : "unprocessed"}',
		INBOX_LIST_ROW_ARIA,
		"InboxView: list row aria",
	);

	// ── ReaderPane hook ──
	next = replaceOne(
		next,
		/function ReaderPane\(\{\s*item,\s*onOpenInChat,\s*onPromote,\s*onProcess,\s*onDelete,\s*onPatch,\s*onClose,\s*\}: \{\s*item: InboxItem;\s*onOpenInChat: \(\) => void;\s*onPromote: \(\) => void;\s*onProcess: \(\) => void;\s*onDelete: \(\) => void;\s*onPatch: \(body: Parameters<typeof inboxApi\.update>\[1\]\) => void;\s*onClose: \(\) => void;\s*\}\) \{/,
		INBOX_READER_HOOK,
		"InboxView: inject ReaderPane hook",
	);


	// ReaderPane mark processed/unprocessed label
	next = replaceOne(
		next,
		'label={item.processedAt ? "Mark unprocessed" : "Mark processed"}',
		INBOX_READER_MARK_LABEL,
		"InboxView: reader mark label",
	);

	// ReaderPane Delete label
	next = replaceOne(next, 'label="Delete"', INBOX_READER_DELETE_LABEL, "InboxView: reader delete label");

	// ReaderPane Promote to task label
	next = replaceOne(next, 'label="Promote to task"', INBOX_READER_PROMOTE_LABEL, "InboxView: reader promote label");

	// ReaderPane Open in chat hint
	next = replaceOne(
		next,
		'title="Open this item as a new chat session"',
		INBOX_READER_OPEN_IN_CHAT_HINT,
		"InboxView: reader open in chat hint",
	);

	// ReaderPane Open in chat text
	next = replaceOne(next, "<span>Open in chat</span>", INBOX_READER_OPEN_IN_CHAT, "InboxView: reader open in chat");

	// ReaderPane Close label
	next = replaceOne(next, 'label="Close"', INBOX_READER_CLOSE_LABEL, "InboxView: reader close label");

	// ReaderPane Untitled placeholder
	next = replaceOne(next, 'placeholder="Untitled"', INBOX_READER_UNTITLED, "InboxView: reader untitled placeholder");

	// ReaderPane add notes placeholder
	next = replaceOne(
		next,
		'placeholder="Click to add notes…"',
		INBOX_READER_ADD_NOTES,
		"InboxView: reader add notes placeholder",
	);
	// ReaderPane kind option ({KIND_LABEL[k]})
	next = replaceOne(next, '{KIND_LABEL[k]}', INBOX_READER_KIND_OPTION, "InboxView: reader kind option");

	// ── ComposePane hook ──
	next = replaceOne(
		next,
		/function ComposePane\(\{\s*onClose,\s*onCreated,\s*\}: \{\s*onClose: \(\) => void;\s*onCreated: \(item: InboxItem\) => void;\s*\}\) \{/,
		INBOX_COMPOSE_HOOK,
		"InboxView: inject ComposePane hook",
	);
	// ComposePane kind option ({KIND_LABEL[k]})
	next = replaceOne(next, '{KIND_LABEL[k]}', INBOX_COMPOSE_KIND_OPTION, "InboxView: compose kind option");


	// ComposePane Cancel
	next = replaceOne(next, ">\n\t\t\t\t\t\tCancel\n\t\t\t\t\t<", INBOX_COMPOSE_CANCEL, "InboxView: compose cancel");

	// ComposePane Capture button
	next = replaceOne(next, ">\n\t\t\t\t\t\tCapture\n\t\t\t\t\t<", INBOX_COMPOSE_CAPTURE, "InboxView: compose capture button");

	// ComposePane title placeholder
	next = replaceOne(
		next,
		'placeholder="Title — short summary of the thought"',
		INBOX_COMPOSE_TITLE_PLACEHOLDER,
		"InboxView: compose title placeholder",
	);

	// ComposePane save hint
	next = replaceOne(
		next,
		/⌘\+enter to save · esc to cancel/,
		INBOX_COMPOSE_SAVE_HINT,
		"InboxView: compose save hint",
	);

	// ComposePane body placeholder
	next = replaceOne(
		next,
		'placeholder="Body — details, context, links… (markdown supported)"',
		INBOX_COMPOSE_BODY_PLACEHOLDER,
		"InboxView: compose body placeholder",
	);

	// ── EmptyReader hook ──
	next = replaceOne(
		next,
		/function EmptyReader\(\{ onCompose \}: \{ onCompose: \(\) => void \}\) \{/,
		INBOX_EMPTY_READER_HOOK,
		"InboxView: inject EmptyReader hook",
	);

	// EmptyReader detail text
	next = replaceOne(
		next,
		'<div className="text-sm text-ink-3">Pick an item to read, or capture a new one.</div>',
		INBOX_EMPTY_READER_DETAIL,
		"InboxView: empty reader detail",
	);

	// EmptyReader Capture button
	next = replaceOne(next, />\s*Capture\s*</, INBOX_EMPTY_READER_CAPTURE, "InboxView: empty reader capture button");

	next = replaceOne(
		next,
		"`Help me act on this. If it's actionable, propose a concrete next step;`,",
		`t("inbox.openChatDraftLine1"),`,
		"InboxView: open chat draft line1",
	);
	next = replaceOne(
		next,
		"`if it's a decision needing input, frame the choice; if it should become a`,",
		`t("inbox.openChatDraftLine2"),`,
		"InboxView: open chat draft line2",
	);
	next = replaceOne(
		next,
		"`task, POST /api/tasks and report the new task id.`,",
		`t("inbox.openChatDraftLine3"),`,
		"InboxView: open chat draft line3",
	);

	return next;
}
