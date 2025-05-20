#!/usr/bin/env node

/**
 * This script exports the SQL from create_tables.sql and provides instructions
 * on how to run it in the Supabase SQL Editor.
 * 
 * Run with: node scripts/db/setup-database.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Validate environment variables
if (!supabaseUrl) {
  console.error('Error: Missing Supabase URL in environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL is set in .env.local');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('Reading SQL script...');
    const sqlFilePath = path.join(__dirname, 'create_tables.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('\n===================================================');
    console.log('SUPABASE DATABASE SETUP INSTRUCTIONS');
    console.log('===================================================');
    console.log(`\n1. Open your Supabase project dashboard at: ${supabaseUrl.replace('https://','').replace('.supabase.co','')}`);
    console.log('2. Navigate to "SQL Editor" in the left sidebar');
    console.log('3. Click "New Query"');
    console.log('4. Copy and paste the SQL script below into the editor');
    console.log('5. Click "Run" to execute the script');
    console.log('\n===================================================');
    console.log('SQL SCRIPT TO RUN:');
    console.log('===================================================\n');
    console.log(sqlScript);
    console.log('\n===================================================');
    console.log('END OF SQL SCRIPT');
    console.log('===================================================\n');

    // Save the SQL to a new file for easy access
    const outputFilePath = path.join(__dirname, 'database-setup.sql');
    fs.writeFileSync(outputFilePath, sqlScript);
    console.log(`SQL script has also been saved to: ${outputFilePath}`);
    console.log(`You can open this file and copy its contents to run in the Supabase SQL Editor.`);
    
  } catch (error) {
    console.error('An error occurred while reading the SQL script:', error);
    process.exit(1);
  }
}

// Run the script
setupDatabase(); 