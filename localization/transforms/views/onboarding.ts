import { injectNamedImport, replaceOne } from "../../utils/string.js";

export function localizeOnboardingView(source: string): string {
	let next = injectNamedImport(source, "react-i18next", "useTranslation");
	// ── OnboardingView hook
	next = replaceOne(
		next,
		/export function OnboardingView\(\) \{\s*const navigate = useNavigate\(\);/,
		`export function OnboardingView() {
	const { t } = useTranslation();
	const navigate = useNavigate();`,
		"OnboardingView: inject hook",
	);
	// ── Step1Welcome hook
	next = replaceOne(
		next,
		/function Step1Welcome\(\{ onNext \}: \{ onNext: \(\) => void \}\) \{\s*return \(/,
		`function Step1Welcome({ onNext }: { onNext: () => void }) {
	const { t } = useTranslation();
	return (`,
		"OnboardingView: inject Step1Welcome hook",
	);
	// ── Step2Kb hook
	next = replaceOne(
		next,
/function Step2Kb\(\{[\s\S]*?\}\) \{/,
		`function Step2Kb({
	state,
	onRefresh,
	onNext,
}: {
	state: OnboardingState;
	onRefresh: () => void;
	onNext: () => void;
}) {
	const { t } = useTranslation();
`,
		"OnboardingView: inject Step2Kb hook",
	);
	// ── Step3Provider hook
	next = replaceOne(
		next,
/function Step3Provider\(\{[\s\S]*?\}\) \{/,
		`function Step3Provider({
	state,
	onRefresh,
	onNext,
}: {
	state: OnboardingState;
	onRefresh: () => void;
	onNext: () => void;
}) {
	const { t } = useTranslation();
`,
		"OnboardingView: inject Step3Provider hook",
	);
	// ── Step4AutoStart hook
	next = replaceOne(
		next,
/function Step4AutoStart\(\{[\s\S]*?\}\) \{/,
		`function Step4AutoStart({
	state,
	onRefresh,
	onNext,
}: {
	state: OnboardingState;
	onRefresh: () => void;
	onNext: () => void;
}) {
	const { t } = useTranslation();
`,
		"OnboardingView: inject Step4AutoStart hook",
	);
	// ── Step5Done hook
	next = replaceOne(
		next,
		/function Step5Done\(\{ onFinish \}: \{ onFinish: \(\) => void \}\) \{/,
		`function Step5Done({ onFinish }: { onFinish: () => void }) {
	const { t } = useTranslation();`,
		"OnboardingView: inject Step5Done hook",
	);
	// ── Text replacements
	next = replaceOne(
		next,
		'<div className="meta text-ink-3">omp·deck onboarding</div>',
		`<div className="meta text-ink-3">{t("onboarding.header")}</div>`,
		"OnboardingView: header",
	);
	next = replaceOne(
		next,
		/\{s\.title\}/,
		`{t("onboarding.steps." + s.key)}`,
		"OnboardingView: step title",
	);
	next = replaceOne(
		next,
		'Skip setup',
		`{t("onboarding.skipSetup")}`,
		"OnboardingView: skip setup",
	);
	next = replaceOne(
		next,
		'title="Mark onboarding done and go straight to the deck"',
		`title={t("onboarding.skipSetup")}`,
		"OnboardingView: skip setup title",
	);
	next = replaceOne(next, 'Welcome to omp·deck', '欢迎使用 omp·deck', "OnboardingView: welcome title");
	next = replaceOne(
		next,
		/A local cockpit for your AI coding agent — multi-session chat, kanban,\s*routines, knowledge base, all loopback-only on this machine\./,
		'面向 AI 编码代理的本地驾驶舱：多会话对话、看板、例程、知识库，全部仅在这台机器上回环运行。',
		"OnboardingView: welcome intro",
	);
	next = replaceOne(next, 'The next few steps will:', '接下来的几步会：', "OnboardingView: next steps lead");
	next = replaceOne(next, 'Scaffold a knowledge base the agent can read from', '建立代理可读取的知识库', "OnboardingView: step1 kb");
	next = replaceOne(next, 'Connect a model provider so chat actually works', '连接模型服务商，让对话真正可用', "OnboardingView: step1 provider");
	next = replaceOne(next, 'Optionally enable an auto-greeting on every new session', '可选地为每个新会话启用自动问候', "OnboardingView: step1 greeting");
	next = replaceOne(
		next,
		/Each step is skippable — you can re-run this wizard any time from\s*Settings → Onboarding\./,
		'每一步都可以跳过，之后也能随时在 设置 → 引导 中重新运行本向导。',
		"OnboardingView: footnote",
	);
	next = replaceOne(next, 'Get started <ChevronRight className="ml-1 h-4 w-4" />', '开始使用 <ChevronRight className="ml-1 h-4 w-4" />', "OnboardingView: get started");
	next = replaceOne(next, '>Knowledge base<', '>知识库<', "OnboardingView: kb title");
	next = replaceOne(
		next,
		/omp·deck's <code className="font-mono">\/kb<\/code> view is a\s*plaintext-portable wiki the agent reads and writes\. Set one up now and\s*the agent has somewhere to put long-term memory\./,
		'omp·deck 的 <code className="font-mono">/kb</code> 视图是一个纯文本可移植 wiki，代理会在这里读写长期记忆。现在先建好它，代理后面就有地方沉淀上下文。',
		"OnboardingView: kb intro",
	);
	next = replaceOne(next, '>Location<', '>位置<', "OnboardingView: location");
	next = replaceOne(
		next,
		/>\s*Change…\s*</,
		">更改…<",
		"OnboardingView: change path",
	);
	next = replaceOne(next, '"Already exists — scaffold will add starter files only if missing."', '"已存在 - 脚手架只会补齐缺失的初始文件。"', "OnboardingView: kb exists");
	next = replaceOne(next, '"Will be created with a README and system/ stubs the agent reads at session start."', '"将创建 README 与 system/ 初始文件，供代理在会话开始时读取。"', "OnboardingView: kb create info");
	next = replaceOne(
		next,
		/<span className="ml-1 text-warn">\s*Path differs from server's resolved root; takes full effect after deck restart\.\s*<\/span>/,
		`<span className="ml-1 text-warn">
							路径与服务端当前解析出的根目录不同；重启 Deck 后才会完全生效。
						</span>`,
		"OnboardingView: path changed hint",
	);
	next = replaceOne(next, /\bSkip this step\b/, '{t("onboarding.skipStep")}', "OnboardingView: skip this step");
	next = replaceOne(next, 'Ready', '准备就绪', "OnboardingView: ready");
	next = replaceOne(next, 'Continue <ChevronRight className="ml-1 h-4 w-4" />', '继续 <ChevronRight className="ml-1 h-4 w-4" />', "OnboardingView: continue");
	next = replaceOne(next, '"Scaffolding…"', '"正在初始化…"', "OnboardingView: scaffolding");
	next = replaceOne(next, '"Create knowledge base"', '"创建知识库"', "OnboardingView: create knowledge base");
	next = replaceOne(next, '>Connect a provider<', '>连接服务商<', "OnboardingView: provider title");
	next = replaceOne(
		next,
		/Pick how the agent talks to a model\. Subscriptions you already pay\s*for \(Claude Pro\/Max, ChatGPT Plus\/Pro\) are the easiest — no API key\s*to manage\. OpenRouter is a pay-as-you-go alternative\./,
		'选择代理连接模型的方式。你已经在付费的订阅（Claude Pro/Max、ChatGPT Plus/Pro）最省心，不需要自己管理 API Key；OpenRouter 则适合按量付费。',
		"OnboardingView: provider intro",
	);
	next = replaceOne(next, '"OAuth subscription via claude.ai"', '"通过 claude.ai 的 OAuth 订阅"', "OnboardingView: claude subtitle");
	next = replaceOne(next, '"OAuth subscription via chatgpt.com"', '"通过 chatgpt.com 的 OAuth 订阅"', "OnboardingView: chatgpt subtitle");
	next = replaceOne(
		next,
		'Pay-as-you-go API key. Single account, hundreds of models.',
		'按量计费的 API Key。一个账户，对接数百个模型。',
		"OnboardingView: openrouter subtitle",
	);
	next = replaceOne(
		next,
		/>\s*Connected\s*</,
		"> 已连接<",
		"OnboardingView: connected",
	);
	next = replaceOne(next, '"Saving…"', '"保存中…"', "OnboardingView: saving");
	next = replaceOne(next, '"Save key"', '"保存 Key"', "OnboardingView: save key");
	next = replaceOne(next, 'Get a key <ExternalLink className="h-3 w-3" />', '获取 Key <ExternalLink className="h-3 w-3" />', "OnboardingView: get key");
	next = replaceOne(
		next,
		/For other providers \(OpenAI direct, Anthropic API, Google, Groq, xAI,\s*etc\.\), see <a href="\/settings" className="underline">Settings → Providers<\/a> after onboarding\./,
		'如果要配置其他服务商（OpenAI 官方 API、Anthropic API、Google、Groq、xAI 等），可在完成引导后前往 <a href="/settings" className="underline">Settings → Providers</a>。',
		"OnboardingView: other providers hint",
	);
	next = replaceOne(next, 'Skip — I\'ll connect later', '跳过 — 稍后连接', "OnboardingView: provider skip later");
	next = replaceOne(next, '>Session greeting<', '>会话问候<', "OnboardingView: autostart title");
	next = replaceOne(
		next,
		/When you start a new chat, the agent can automatically read your\s*knowledge base, query the local API for open tasks \/ inbox \/ routines,\s*and summarize where you are\. Fires once per session\./,
		'创建新对话时，代理可以自动读取知识库、查询本地 API 中的任务 / 收件箱 / 例程状态，并先做一次当前情况概览。每个会话只触发一次。',
		"OnboardingView: autostart intro",
	);
	next = replaceOne(
		next,
		'Preview what the agent will do on each new session',
		'预览代理在每个新会话中会执行的内容',
		"OnboardingView: autostart preview",
	);
	next = replaceOne(next, 'Skip — empty composer is fine', '{t("onboarding.skipGreeting")}', "OnboardingView: skip greeting");
	next = replaceOne(
		next,
		/>\s*Enabled\s*</,
		"> 已启用<",
		"OnboardingView: enabled",
	);
	next = replaceOne(next, '"Enabling…"', '"启用中…"', "OnboardingView: enabling");
	next = replaceOne(next, '"Enable auto-greeting"', '"启用自动问候"', "OnboardingView: enable auto greeting");
	next = replaceOne(next, "You're set up", "设置完成", "OnboardingView: all set title");
	next = replaceOne(
		next,
		/Your deck has a <code className="font-mono">T-1 Welcome<\/code> task in\s*the kanban walking through all the surfaces\. Open it any time from the\s*Tasks tab\./,
		'你的 Deck 已经带有一个 <code className="font-mono">T-1 Welcome</code> 任务，会带你熟悉各个界面；之后随时都能在任务页重新打开。',
		"OnboardingView: done intro",
	);
	next = replaceOne(next, "What's next:", "接下来建议：", "OnboardingView: next title");
	next = replaceOne(next, 'Send a prompt in chat to test your provider connection.', '先发一条消息，确认服务商连接是否正常。', "OnboardingView: next chat");
	next = replaceOne(next, 'Tab to <strong>Tasks</strong> and read <strong>T-1</strong> for a deeper tour.', '切到 <strong>任务</strong> 页，阅读 <strong>T-1</strong> 获取更完整的导览。', "OnboardingView: next tasks");
	next = replaceOne(
		next,
		'Visit <a href="/marketplace" className="underline">Marketplace</a>{" "}\n\t\t\t\t\t\tto install plugins / skills (recommended: claude-plugins-official).',
		'访问 <a href="/marketplace" className="underline">市场</a>{" "}\n\t\t\t\t\t\t安装插件 / 技能（推荐：claude-plugins-official）。',
		"OnboardingView: next marketplace",
	);
	next = replaceOne(next, 'Open chat <ChevronRight className="ml-1 h-4 w-4" />', '打开对话 <ChevronRight className="ml-1 h-4 w-4" />', "OnboardingView: open chat");
	return next;
}
