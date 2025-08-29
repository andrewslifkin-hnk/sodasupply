#!/usr/bin/env node

/**
 * Validation script to test OpenAI API connection
 * Run with: OPENAI_API_KEY=your_key node scripts/validate-openai-connection.js
 */

const { AIPersonaService } = require('../services/ai-persona-service.ts');

async function validateOpenAIConnection() {
  console.log('🔍 Validating OpenAI API Connection');
  console.log('===================================\n');
  
  // Check if API key is set
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('❌ OPENAI_API_KEY environment variable not set');
    console.log('\nPlease set your OpenAI API key:');
    console.log('   export OPENAI_API_KEY="your_openai_api_key_here"');
    console.log('\nThen run this script again.');
    return;
  }
  
  console.log('✅ OpenAI API key found');
  console.log(`   Key preview: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`);
  
  // Test the AI service
  console.log('\n🤖 Testing AI Persona Service...');
  
  const aiService = new AIPersonaService();
  const testPersona = {
    persona_key: 'test',
    label: 'Test Shopper',
    behaviours: {
      session_length: 'medium',
      pages_common: [],
      conversion_latency_hours: 2
    }
  };
  
  try {
    console.log('   Generating test behavior...');
    const behavior = await aiService.generatePersonaBehavior(testPersona, 1);
    
    console.log('✅ AI generation successful!');
    console.log('\n📊 Generated Behavior:');
    console.log('   Search Terms:', behavior.searchTerms?.join(', ') || 'None');
    console.log('   Browsing Actions:', behavior.browsingActions?.join(', ') || 'None');
    console.log('   Product Preferences:', behavior.productPreferences?.join(', ') || 'None');
    console.log('   Decision Factors:', behavior.decisionFactors?.join(', ') || 'None');
    console.log('   Session Duration:', behavior.sessionDuration, 'seconds');
    console.log('   Conversion Likelihood:', (behavior.conversionLikelihood * 100).toFixed(1) + '%');
    console.log('   Interaction Style:', behavior.interactionStyle);
    
    console.log('\n🎉 OpenAI integration is ready!');
    console.log('\nYou can now run AI-enhanced tests with:');
    console.log('   pnpm test:ai');
    
  } catch (error) {
    console.log('❌ AI generation failed');
    console.log('   Error:', error.message);
    console.log('\nPossible issues:');
    console.log('   1. Invalid API key');
    console.log('   2. Insufficient API credits');
    console.log('   3. Network connectivity issues');
    console.log('   4. Rate limiting');
    console.log('\nThe tests will fall back to deterministic behaviors if AI fails.');
  }
}

// Handle ES module vs CommonJS issues
if (typeof require !== 'undefined' && require.main === module) {
  validateOpenAIConnection().catch(console.error);
} else {
  // Fallback for ES modules
  console.log('⚠️  Note: This validation script requires a real OpenAI API key to test the connection.');
  console.log('Set OPENAI_API_KEY and run: node scripts/validate-openai-connection.js');
}
