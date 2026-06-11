import { cp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { localizeNavRail, localizeSidebar, localizeNotificationPermissionBanner, localizeNotificationToast, localizeLayout } from "./transforms/components.js";
import { localizeI18nIndex } from "./transforms/i18n.js";
import { localizeSettingsView } from "./transforms/views/settings.js";
import { localizeTasksView } from "./transforms/views/tasks.js";
import { localizeInboxView } from "./transforms/views/inbox.js";
import { localizeRoutinesView } from "./transforms/views/routines.js";
import { localizeMarketplaceView } from "./transforms/views/marketplace.js";
import { localizeKbView } from "./transforms/views/kb.js";
import { localizeIntegrationsView } from "./transforms/views/integrations.js";
import { localizeOnboardingView } from "./transforms/views/onboarding.js";
import { localizeSkillsView } from "./transforms/views/skills.js";

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
	await transformGeneratedFile(path.join("views", "SkillsView.tsx"), localizeSkillsView);
	await transformGeneratedFile(path.join("views", "TasksView.tsx"), localizeTasksView);
	await transformGeneratedFile(path.join("views", "InboxView.tsx"), localizeInboxView);
	await transformGeneratedFile(path.join("views", "RoutinesView.tsx"), localizeRoutinesView);
	await transformGeneratedFile(path.join("views", "MarketplaceView.tsx"), localizeMarketplaceView);
	await transformGeneratedFile(path.join("views", "KbView.tsx"), localizeKbView);
	await transformGeneratedFile(path.join("views", "IntegrationsView.tsx"), localizeIntegrationsView);
	await transformGeneratedFile(path.join("views", "OnboardingView.tsx"), localizeOnboardingView);
}

async function transformGeneratedFile(relPath: string, transform: (source: string) => string): Promise<void> {
	const fullPath = path.join(generatedSrc, relPath);
	const source = await readFile(fullPath, "utf8");
	const normalized = source.replace(/\r\n/g, "\n");
	await writeFile(fullPath, transform(normalized), "utf8");
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

void main().catch((error) => {
	console.error("[l10n:prepare] failed:", error);
	process.exitCode = 1;
});
