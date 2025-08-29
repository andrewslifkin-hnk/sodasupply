#!/usr/bin/env node

/**
 * Results Analyzer - Makes JSONL test results human-readable
 * Usage: node scripts/analyze-results.js [results-file.jsonl]
 */

const fs = require('fs');
const path = require('path');

class ResultsAnalyzer {
  constructor(filePath) {
    this.filePath = filePath;
    this.results = [];
    this.loadResults();
  }

  loadResults() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      this.results = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.warn('Failed to parse line:', line.substring(0, 100) + '...');
          return null;
        }
      }).filter(Boolean);
      
      console.log(`✅ Loaded ${this.results.length} test results from ${path.basename(this.filePath)}\n`);
    } catch (error) {
      console.error('❌ Failed to load results file:', error.message);
      process.exit(1);
    }
  }

  generateReport() {
    this.printHeader();
    this.printExecutiveSummary();
    this.printDetailedResults();
    this.printPersonaAnalysis();
    this.printConversionAnalysis();
    this.printAIBehaviorAnalysis();
    this.printRecommendations();
  }

  printHeader() {
    const fileName = path.basename(this.filePath);
    console.log('🔍 TEST RESULTS ANALYSIS');
    console.log('========================');
    console.log(`📁 File: ${fileName}`);
    console.log(`📊 Total Users: ${this.results.length}`);
    console.log(`⏰ Test Date: ${new Date(this.results[0]?.ts).toLocaleDateString()}`);
    console.log('');
  }

  printExecutiveSummary() {
    const completed = this.results.filter(r => r.status === 'completed').length;
    const abandonedCart = this.results.filter(r => r.status === 'abandoned_cart').length;
    const failed = this.results.filter(r => r.status.includes('failed')).length;
    
    const conversionRate = ((completed / this.results.length) * 100).toFixed(1);
    const abandonmentRate = ((abandonedCart / this.results.length) * 100).toFixed(1);
    
    console.log('📈 EXECUTIVE SUMMARY');
    console.log('====================');
    console.log(`🎯 Conversion Rate: ${conversionRate}% (${completed}/${this.results.length})`);
    console.log(`🛒 Cart Abandonment: ${abandonmentRate}% (${abandonedCart} users)`);
    console.log(`❌ Technical Failures: ${failed} users`);
    console.log('');
  }

  printDetailedResults() {
    console.log('👥 INDIVIDUAL USER JOURNEYS');
    console.log('============================');
    
    this.results.forEach((result, index) => {
      const statusEmoji = this.getStatusEmoji(result.status);
      const conversionPercent = result.aiBehavior?.conversionLikelihood 
        ? (result.aiBehavior.conversionLikelihood * 100).toFixed(0) + '%'
        : 'N/A';
      
      console.log(`${statusEmoji} User ${result.userIndex}: ${result.persona.toUpperCase()} (${result.variant})`);
      
      if (result.aiBehavior) {
        console.log(`   🤖 AI Style: ${result.aiBehavior.interactionStyle}`);
        console.log(`   💡 Predicted Conversion: ${conversionPercent}`);
        console.log(`   🔍 Search Terms: ${result.aiBehavior.searchTerms?.join(', ') || 'None'}`);
        console.log(`   ⏱️  Session Duration: ${result.aiBehavior.sessionDuration}s`);
        console.log(`   🎯 Decision Factors: ${result.aiBehavior.decisionFactors?.join(', ') || 'None'}`);
      }
      
      console.log(`   📍 Final Status: ${result.status.replace('_', ' ').toUpperCase()}`);
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
      console.log('');
    });
  }

  printPersonaAnalysis() {
    console.log('🎭 PERSONA PERFORMANCE');
    console.log('======================');
    
    const personaStats = {};
    
    this.results.forEach(result => {
      if (!personaStats[result.persona]) {
        personaStats[result.persona] = {
          total: 0,
          completed: 0,
          abandoned: 0,
          failed: 0,
          avgPredictedConversion: []
        };
      }
      
      const stats = personaStats[result.persona];
      stats.total++;
      
      if (result.status === 'completed') stats.completed++;
      else if (result.status === 'abandoned_cart') stats.abandoned++;
      else stats.failed++;
      
      if (result.aiBehavior?.conversionLikelihood) {
        stats.avgPredictedConversion.push(result.aiBehavior.conversionLikelihood);
      }
    });
    
    Object.entries(personaStats).forEach(([persona, stats]) => {
      const conversionRate = ((stats.completed / stats.total) * 100).toFixed(1);
      const avgPredicted = stats.avgPredictedConversion.length > 0
        ? (stats.avgPredictedConversion.reduce((a, b) => a + b, 0) / stats.avgPredictedConversion.length * 100).toFixed(1)
        : 'N/A';
      
      console.log(`📊 ${persona.toUpperCase()}: ${stats.total} users`);
      console.log(`   ✅ Completed: ${stats.completed} (${conversionRate}%)`);
      console.log(`   🛒 Abandoned: ${stats.abandoned}`);
      console.log(`   ❌ Failed: ${stats.failed}`);
      console.log(`   🤖 AI Predicted: ${avgPredicted}% conversion`);
      console.log('');
    });
  }

  printConversionAnalysis() {
    console.log('💰 CONVERSION ANALYSIS');
    console.log('======================');
    
    const aiResults = this.results.filter(r => r.aiBehavior?.conversionLikelihood);
    
    if (aiResults.length === 0) {
      console.log('No AI behavior data available for conversion analysis.\n');
      return;
    }
    
    // Group by predicted conversion likelihood ranges
    const ranges = {
      'High (70-100%)': aiResults.filter(r => r.aiBehavior.conversionLikelihood >= 0.7),
      'Medium (40-69%)': aiResults.filter(r => r.aiBehavior.conversionLikelihood >= 0.4 && r.aiBehavior.conversionLikelihood < 0.7),
      'Low (0-39%)': aiResults.filter(r => r.aiBehavior.conversionLikelihood < 0.4)
    };
    
    Object.entries(ranges).forEach(([range, users]) => {
      if (users.length === 0) return;
      
      const actualConversions = users.filter(u => u.status === 'completed').length;
      const actualRate = ((actualConversions / users.length) * 100).toFixed(1);
      
      console.log(`🎯 ${range}: ${users.length} users`);
      console.log(`   Actual Conversion Rate: ${actualRate}% (${actualConversions}/${users.length})`);
      console.log('');
    });
  }

  printAIBehaviorAnalysis() {
    console.log('🤖 AI BEHAVIOR INSIGHTS');
    console.log('========================');
    
    const aiResults = this.results.filter(r => r.aiBehavior);
    
    if (aiResults.length === 0) {
      console.log('No AI behavior data available.\n');
      return;
    }
    
    // Interaction styles
    const styleStats = {};
    aiResults.forEach(r => {
      const style = r.aiBehavior.interactionStyle;
      if (!styleStats[style]) styleStats[style] = { total: 0, completed: 0 };
      styleStats[style].total++;
      if (r.status === 'completed') styleStats[style].completed++;
    });
    
    console.log('🎭 Interaction Styles:');
    Object.entries(styleStats).forEach(([style, stats]) => {
      const rate = ((stats.completed / stats.total) * 100).toFixed(1);
      console.log(`   ${style}: ${stats.total} users, ${rate}% conversion`);
    });
    console.log('');
    
    // Most common search terms
    const allSearchTerms = aiResults
      .flatMap(r => r.aiBehavior.searchTerms || [])
      .reduce((acc, term) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {});
    
    const topSearchTerms = Object.entries(allSearchTerms)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    if (topSearchTerms.length > 0) {
      console.log('🔍 Top Search Terms:');
      topSearchTerms.forEach(([term, count]) => {
        console.log(`   "${term}": ${count} users`);
      });
      console.log('');
    }
    
    // Decision factors
    const allFactors = aiResults
      .flatMap(r => r.aiBehavior.decisionFactors || [])
      .reduce((acc, factor) => {
        acc[factor] = (acc[factor] || 0) + 1;
        return acc;
      }, {});
    
    const topFactors = Object.entries(allFactors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    if (topFactors.length > 0) {
      console.log('💭 Key Decision Factors:');
      topFactors.forEach(([factor, count]) => {
        console.log(`   "${factor}": ${count} users`);
      });
      console.log('');
    }
  }

  printRecommendations() {
    console.log('💡 RECOMMENDATIONS');
    console.log('==================');
    
    const completed = this.results.filter(r => r.status === 'completed').length;
    const total = this.results.length;
    const conversionRate = (completed / total) * 100;
    
    if (conversionRate < 30) {
      console.log('🔴 LOW CONVERSION RATE DETECTED');
      console.log('   • Consider simplifying the checkout process');
      console.log('   • Review product pricing and positioning');
      console.log('   • Analyze cart abandonment points');
    } else if (conversionRate < 60) {
      console.log('🟡 MODERATE CONVERSION RATE');
      console.log('   • Optimize for mobile experience');
      console.log('   • A/B test different call-to-action buttons');
      console.log('   • Consider exit-intent popups');
    } else {
      console.log('🟢 STRONG CONVERSION RATE');
      console.log('   • Focus on increasing average order value');
      console.log('   • Scale successful tactics to more traffic');
      console.log('   • Test premium product positioning');
    }
    
    console.log('');
    console.log('📊 Next Steps:');
    console.log('   • Run larger sample sizes for statistical significance');
    console.log('   • Compare A/B test variants with equal sample sizes');
    console.log('   • Analyze specific failure points in the user journey');
    console.log('   • Monitor real user behavior correlation with AI predictions');
  }

  getStatusEmoji(status) {
    switch (status) {
      case 'completed': return '✅';
      case 'abandoned_cart': return '🛒';
      case 'failed_add_to_cart': return '🛍️';
      case 'failed': return '❌';
      default: return '❓';
    }
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
      console.log('\nTry: pnpm test:ai');
      process.exit(1);
    }
    
    console.log(`📁 Using most recent results file: ${files[0]}\n`);
    const analyzer = new ResultsAnalyzer(files[0]);
    analyzer.generateReport();
  } else {
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    const analyzer = new ResultsAnalyzer(filePath);
    analyzer.generateReport();
  }
}

if (require.main === module) {
  main();
}
