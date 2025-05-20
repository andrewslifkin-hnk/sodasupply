/**
 * This script helps to generate the Hypertune client code
 * It can be run with `node scripts/generate-flags.js`
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
    console.log('✅ Loaded environment variables from .env.local');
  } else {
    console.warn('⚠️ No .env.local file found. Using existing environment variables.');
  }
} catch (error) {
  console.error('❌ Error loading .env.local:', error.message);
}

// Check if Hypertune token is set
if (!process.env.HYPERTUNE_TOKEN) {
  console.error('❌ HYPERTUNE_TOKEN environment variable is not set!');
  console.log('  - Create a .env.local file with your Hypertune token');
  console.log('  - Or run the command with the token: HYPERTUNE_TOKEN=<your-token> node scripts/generate-flags.js');
  process.exit(1);
}

// Output directory configuration
const outputDir = process.env.HYPERTUNE_OUTPUT_DIRECTORY_PATH || 'generated';
const fullOutputPath = path.resolve(process.cwd(), outputDir);

// Create the output directory if it doesn't exist
if (!fs.existsSync(fullOutputPath)) {
  try {
    fs.mkdirSync(fullOutputPath, { recursive: true });
    console.log(`✅ Created output directory: ${outputDir}`);
  } catch (error) {
    console.error(`❌ Error creating output directory: ${error.message}`);
    process.exit(1);
  }
}

// Configuration for hypertune CLI
const hypertuneArgs = [
  '--token', process.env.HYPERTUNE_TOKEN,
  '--outputDirectoryPath', outputDir
];

// Add includeInitData if it's set to true
if (process.env.HYPERTUNE_INCLUDE_INIT_DATA === 'true') {
  hypertuneArgs.push('--includeInitData');
}

console.log('🔄 Running Hypertune client generation...');

// Run the hypertune CLI command
const hypertuneProcess = spawn('npx', ['hypertune', ...hypertuneArgs], { 
  stdio: 'inherit',
  shell: true 
});

hypertuneProcess.on('error', (error) => {
  console.error('❌ Failed to start Hypertune CLI:', error.message);
});

hypertuneProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`✅ Successfully generated Hypertune client in ${outputDir}/`);
    console.log('🚀 You can now import it in your code!');
  } else {
    console.error(`❌ Hypertune client generation failed with code ${code}`);
  }
}); 