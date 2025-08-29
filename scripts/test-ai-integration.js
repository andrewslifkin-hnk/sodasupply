#!/usr/bin/env node

/**
 * Simple demonstration script to test AI persona generation
 * Run with: node scripts/test-ai-integration.js
 */

// Since this is a .js file, we need to use require syntax
const fs = require('fs');
const path = require('path');

// Mock the OpenAI client for demonstration
class MockOpenAI {
  async chat() {
    return {
      choices: [{
        message: {
          content: JSON.stringify({
            searchTerms: ["energy drinks", "BODYARMOR", "sports drinks"],
            browsingActions: ["browse products", "filter by category", "compare prices"],
            productPreferences: ["sports drinks", "natural ingredients"],
            decisionFactors: ["price", "brand reputation", "nutritional value"],
            sessionDuration: 45,
            conversionLikelihood: 0.75,
            interactionStyle: "quick"
          })
        }
      }]
    };
  }
}

// Simple version of the AI service for testing
class TestAIPersonaService {
  constructor() {
    this.isEnabled = true; // Mock as enabled
    this.client = new MockOpenAI();
  }

  async generatePersonaBehavior(persona, userIndex) {
    console.log(`\n🤖 Generating AI behavior for User ${userIndex}: ${persona.label}`);
    
    try {
      const response = await this.client.chat();
      const aiResponse = response.choices[0]?.message?.content;
      const parsed = JSON.parse(aiResponse);
      
      console.log(`   Search Terms: ${parsed.searchTerms.join(', ')}`);
      console.log(`   Interaction Style: ${parsed.interactionStyle}`);
      console.log(`   Conversion Likelihood: ${(parsed.conversionLikelihood * 100).toFixed(1)}%`);
      console.log(`   Decision Factors: ${parsed.decisionFactors.join(', ')}`);
      
      return parsed;
    } catch (error) {
      console.error(`   ❌ AI generation failed:`, error.message);
      return this.getFallbackBehavior(persona);
    }
  }

  getFallbackBehavior(persona) {
    console.log(`   🔄 Using fallback behavior for ${persona.label}`);
    return {
      searchTerms: ['soda', 'beverage'],
      browsingActions: ['browse products'],
      productPreferences: ['popular brands'],
      decisionFactors: ['price'],
      sessionDuration: 60,
      conversionLikelihood: 0.5,
      interactionStyle: 'quick'
    };
  }
}

async function demonstrateAIIntegration() {
  console.log('🚀 AI Persona Integration Demo');
  console.log('================================\n');
  
  // Load personas
  const personasPath = path.join(__dirname, '../tests/personas_eazle_synthetic.json');
  const personas = JSON.parse(fs.readFileSync(personasPath, 'utf-8'));
  
  console.log(`📋 Loaded ${personas.length} personas:`);
  personas.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.label} (${p.persona_key})`);
  });
  
  // Create AI service
  const aiService = new TestAIPersonaService();
  
  // Generate behaviors for a few sample users
  console.log('\n🎭 Generating Sample User Behaviors:');
  console.log('=====================================');
  
  for (let i = 1; i <= 5; i++) {
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    await aiService.generatePersonaBehavior(randomPersona, i);
    
    // Add small delay to simulate real API calls
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✅ Demo completed!');
  console.log('\nTo run the actual AI-enhanced tests:');
  console.log('   1. Set your OpenAI API key: export OPENAI_API_KEY="your_key_here"');
  console.log('   2. Run: pnpm test:ai');
  console.log('   3. Or run in headed mode: pnpm test:ai-headed');
}

// Run the demo
demonstrateAIIntegration().catch(console.error);
