export function replaceOne(source: string, search: RegExp | string, replacement: string, label: string): string {
	const next = source.replace(search, replacement);
	if (next === source) {
		throw new Error(`${label} not found`);
	}
	return next;
}

export function injectNamedImport(source: string, moduleName: string, importName: string): string {
	const importLine = `import { ${importName} } from "${moduleName}";`;
	if (source.includes(importLine)) return source;

	const lines = source.split(/\r?\n/);
	const lastImportIndex = findLastImportIndex(lines);
	if (lastImportIndex === -1) return `${importLine}\n${source}`;
	lines.splice(lastImportIndex + 1, 0, importLine);
	return `${lines.join("\n")}\n`;
}

function findLastImportIndex(lines: string[]): number {
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		if (lines[i]?.startsWith("import ")) return i;
	}
	return -1;
}
