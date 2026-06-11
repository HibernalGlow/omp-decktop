import { replaceOne } from "../utils/string.js";
import { DETECT_LOCALE_FN } from "../translations.js";

export function localizeI18nIndex(source: string): string {
	return replaceOne(
		source,
		/function detectLocale\(\): string \{[\s\S]*?\n\}/,
		DETECT_LOCALE_FN,
		"i18n index: default zh locale",
	);
}
