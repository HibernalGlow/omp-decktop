import type {
	CcSwitchImportRequest,
	CcSwitchImportResponse,
	CcSwitchListResponse,
} from "@omp-deck/protocol";

const BASE = "/api/ccswitch";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		...init,
		headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(body || `HTTP ${res.status} ${path}`);
	}
	return (await res.json()) as T;
}

export const ccSwitchApi = {
	listProviders(): Promise<CcSwitchListResponse> {
		return req<CcSwitchListResponse>("/providers");
	},
	importProviders(providerKeys: string[], dbPath?: string): Promise<CcSwitchImportResponse> {
		return req<CcSwitchImportResponse>("/import", {
			method: "POST",
			body: JSON.stringify({ providerKeys, dbPath } satisfies CcSwitchImportRequest),
		});
	},
};
