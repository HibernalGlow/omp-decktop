import { injectNamedImport, replaceOne } from "../../utils/string.js";
import {
	ZH_SETTINGS_SECTIONS,
	SETTINGS_TOP_TITLE,
	SETTINGS_TOP_SUBTITLE,
	SETTINGS_LANG_BRANCH,
	SETTINGS_ENV_TITLE,
	SETTINGS_MESSAGING_TITLE,
	SETTINGS_APPEARANCE_TITLE,
	SETTINGS_NOTIFICATIONS_TITLE,
	SETTINGS_ORIENTATION_TITLE,
	SETTINGS_NOTES_TITLE,
	SETTINGS_NOTES_BODY,
	SETTINGS_SIDE_RAIL,
	SETTINGS_STUB_TITLE,
	SETTINGS_STUB_BODY,
	SETTINGS_PROVIDERS_LOADING,
	SETTINGS_PROVIDERS_META,
	LANGUAGE_SECTION_CODE,
	SETTINGS_STUB_SECTION_SIG,
} from "../../translations.js";

export function localizeSettingsView(source: string): string {
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
