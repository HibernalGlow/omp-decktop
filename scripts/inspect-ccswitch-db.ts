import { Database } from "bun:sqlite";

const dbPath = "C:/Users/30902/.cc-switch/cc-switch.db";
const db = new Database(dbPath, { readonly: true });

// Get all providers with settings_config
console.log("=== ALL PROVIDERS ===");
const providers = db.query(`
  SELECT id, app_type, name, settings_config, website_url, category, is_current, provider_type, meta
  FROM providers
  ORDER BY sort_index
`).all();

for (const p of providers as any[]) {
  console.log(`\n--- Provider: ${p.name} ---`);
  console.log(`  id: ${p.id}`);
  console.log(`  app_type: ${p.app_type}`);
  console.log(`  is_current: ${p.is_current}`);
  console.log(`  provider_type: ${p.provider_type}`);
  console.log(`  website_url: ${p.website_url}`);
  console.log(`  category: ${p.category}`);
  console.log(`  meta: ${p.meta}`);
  try {
    const config = JSON.parse(p.settings_config);
    // Mask API keys for display
    const masked = { ...config };
    if (masked.apiKey) masked.apiKey = masked.apiKey.slice(0, 8) + "...";
    if (masked.api_key) masked.api_key = masked.api_key.slice(0, 8) + "...";
    console.log(`  settings_config:`, JSON.stringify(masked, null, 2));
  } catch {
    console.log(`  settings_config (raw): ${p.settings_config}`);
  }
}

// provider_endpoints
console.log("\n=== PROVIDER_ENDPOINTS TABLE STRUCTURE ===");
const eInfo = db.query("PRAGMA table_info('provider_endpoints')").all();
console.log(JSON.stringify(eInfo, null, 2));

console.log("\n=== ALL PROVIDER_ENDPOINTS ===");
const endpoints = db.query("SELECT * FROM provider_endpoints").all();
console.log(JSON.stringify(endpoints, null, 2));

db.close();
