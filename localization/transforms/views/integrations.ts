import { injectNamedImport, replaceOne } from "../../utils/string.js";

export function localizeIntegrationsView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	// ── IntegrationsView hook
	next = replaceOne(
		next,
		/export function IntegrationsView\(\) \{\s*return \(/,
		`export function IntegrationsView() {
	const { t } = useTranslation();
	return (`,
		"IntegrationsView: inject hook",
	);
	// ── Title and text replacements
	next = replaceOne(next, '<div className="meta mb-2">Integrations</div>', `<div className="meta mb-2">{t("integrations.title")}</div>`, "IntegrationsView: sidebar title");
	next = replaceOne(next, '<div className="meta">Integrations</div>', `<div className="meta">{t("integrations.title")}</div>`, "IntegrationsView: header title");
	next = replaceOne(
		next,
		'<h2 className="text-lg font-medium text-ink">Coming in V1.5</h2>',
		`<h2 className="text-lg font-medium text-ink">{t("integrations.comingTitle")}</h2>`,
		"IntegrationsView: coming title",
	);
	next = replaceOne(
		next,
		'<div className="meta mb-1.5">Design doc</div>',
		`<div className="meta mb-1.5">{t("integrations.designDoc")}</div>`,
		"IntegrationsView: design doc label",
	);
	next = replaceOne(
		next,
		'V1.5 will surface installed MCP servers and one-click Workspace setup.',
		'V1.5 会提供已安装 MCP Server 展示与一键式 Workspace 配置。',
		"IntegrationsView: sidebar hint",
	);
	next = replaceOne(
		next,
		/<p className="text-sm text-ink-2">\s*The Integrations page will host one-click installs[\s\S]*?panel\.\s*<\/p>/,
		`<p className="text-sm text-ink-2">
								集成页面将在未来承载精选 MCP Server 目录的一键安装，例如{" "}
								<a
									href="https://github.com/taylorwilsdon/google_workspace_mcp"
									target="_blank"
									rel="noreferrer"
									className="text-accent hover:underline"
								>
									Google Workspace
								</a>{" "}
								（Gmail、Calendar、Drive、Docs 等）、Slack、GitHub、Linear、Notion、Discord，同时补上租户级 OAuth、自动刷新与 advertised-tools 面板。
							</p>`,
		"IntegrationsView: intro paragraph",
	);
	next = replaceOne(
		next,
		/<p className="text-sm text-ink-2">\s*<strong className="text-ink">In V1:<\/strong>[\s\S]*?mcp_servers_allowed: \[\.\.\.\]<\/code>\.\s*<\/p>/,
		`<p className="text-sm text-ink-2">
								<strong className="text-ink">当前 V1：</strong> 你已经可以在聊天里通过{" "}
								<code className="paper-code px-1 py-0.5 text-xs">/mcp install &lt;url-or-smithery-id&gt;</code>{" "}
								或{" "}
								<code className="paper-code px-1 py-0.5 text-xs">/mcp smithery-search &lt;query&gt;</code>
								安装 MCP Server。安装完成后，任何例程中的 <code>agent</code> 步骤都可以通过{" "}
								<code className="paper-code px-1 py-0.5 text-xs">mcp_servers_allowed: [...]</code> 使用它们。
							</p>`,
		"IntegrationsView: v1 paragraph",
	);
	next = replaceOne(
		next,
		/<p className="text-sm text-ink-2">\s*The dedicated <code>mcp<\/code> step type[\s\S]*?deferred\.\s*<\/p>/,
		`<p className="text-sm text-ink-2">
								专用的 <code>mcp</code> 步骤类型也会在 V1.5 一并落地；等 SDK bridge 暴露直接的{" "}
								<code className="paper-code px-1 py-0.5 text-xs">callMcpTool()</code>{" "}
								接口后，就能支持确定性工具调用。当前 schema 已接受该步骤定义，只是执行层暂未启用。
							</p>`,
		"IntegrationsView: mcp step paragraph",
	);
	return next;
}
