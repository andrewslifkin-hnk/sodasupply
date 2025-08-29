#!/usr/bin/env node

/**
 * CSV Exporter - Converts JSONL results to CSV for spreadsheet analysis
 * Usage: node scripts/export-csv.js [results-file.jsonl]
 */

const fs = require('fs');
const path = require('path');

function jsonlToCsv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    const results = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    if (results.length === 0) {
      console.error('❌ No valid results found in file');
      return;
    }
    
    // CSV headers
    const headers = [
      'User Index',
      'Persona',
      'Variant',
      'Status',
      'AI Interaction Style',
      'AI Predicted Conversion %',
      'AI Session Duration',
      'AI Search Terms',
      'AI Decision Factors',
      'Final URL',
      'Timestamp',
      'Error'
    ];
    
    // Convert each result to CSV row
    const rows = results.map(result => {
      return [
        result.userIndex || '',
        result.persona || '',
        result.variant || '',
        result.status || '',
        result.aiBehavior?.interactionStyle || '',
        result.aiBehavior?.conversionLikelihood ? (result.aiBehavior.conversionLikelihood * 100).toFixed(1) : '',
        result.aiBehavior?.sessionDuration || '',
        result.aiBehavior?.searchTerms?.join('; ') || '',
        result.aiBehavior?.decisionFactors?.join('; ') || '',
        result.finalUrl || '',
        result.ts || '',
        result.error || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });
    
    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');
    
    // Write to file in same directory
    const outputFile = filePath.replace('.jsonl', '.csv');
    fs.writeFileSync(outputFile, csv, 'utf-8');
    
    console.log(`✅ Exported ${results.length} results to: ${path.basename(outputFile)}`);
    console.log(`📊 Open in Excel, Google Sheets, or any spreadsheet program`);
    
  } catch (error) {
    console.error('❌ Failed to convert to CSV:', error.message);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Find the most recent results file in organized directory
    const resultsDir = './test-results/synthetic-users';
    const legacyResults = fs.existsSync('.') ? fs.readdirSync('.').filter(file => file.startsWith('results_') && file.endsWith('.jsonl')) : [];
    const organizedResults = fs.existsSync(resultsDir) ? fs.readdirSync(resultsDir).filter(file => file.startsWith('results_') && file.endsWith('.jsonl')).map(file => `${resultsDir}/${file}`) : [];
    
    const files = [...organizedResults, ...legacyResults]
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.error('❌ No results files found. Run a test first!');
      process.exit(1);
    }
    
    console.log(`📁 Converting most recent results file: ${files[0]}`);
    jsonlToCsv(files[0]);
  } else {
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    jsonlToCsv(filePath);
  }
}

if (require.main === module) {
  main();
}
