const fs = require('fs');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Supabase credentials tidak ditemukan di .env.local');
  process.exit(1);
}

async function executeSQLViaHTTPS(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/query`);
    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

async function runMigration(file) {
  console.log(`\nRunning migration: ${file}`);
  
  try {
    const sql = fs.readFileSync(file, 'utf8');
    await executeSQLViaHTTPS(sql);
    console.log(`✓ Migration ${file} completed successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Migration ${file} failed:`, error.message);
    return false;
  }
}

async function main() {
  console.log('======================================');
  console.log('  Supabase Database Setup');
  console.log('======================================');
  console.log(`URL: ${SUPABASE_URL}`);
  
  const migrations = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_storage_setup.sql'
  ];

  let success = true;
  for (const migration of migrations) {
    if (fs.existsSync(migration)) {
      const result = await runMigration(migration);
      if (!result) success = false;
    } else {
      console.log(`⚠ Migration file not found: ${migration}`);
    }
  }

  if (success) {
    console.log('\n✓ All migrations completed!');
    console.log('\nNext steps:');
    console.log('1. Create admin user in Supabase Dashboard');
    console.log('2. Run: pnpm dev');
  } else {
    console.log('\n✗ Some migrations failed. Please run them manually in Supabase SQL Editor.');
  }
}

main().catch(console.error);
