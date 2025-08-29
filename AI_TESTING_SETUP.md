# AI-Enhanced User Testing Setup

This guide explains how to use the AI-enhanced Playwright testing with your custom Eazle Test Lab GPT.

## Overview

The AI integration uses OpenAI's API to generate realistic, varied user behaviors for each persona during testing. This creates more authentic test scenarios that better simulate real user interactions.

## Setup

### 1. Install Dependencies

The OpenAI package has already been installed:
```bash
pnpm add openai
```

### 2. Configure OpenAI API Key

Set your OpenAI API key as an environment variable:

```bash
# Option 1: Set directly in terminal
export OPENAI_API_KEY="your_openai_api_key_here"

# Option 2: Create a .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Environment Variables

Available configuration options:

```bash
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here

# Test configuration
EAZLE_BASE_URL=https://sodasupply.vercel.app/products
AB_ASSIGNMENT=random              # 'random' or 'env'
AB_VARIANT=control               # 'control' or 'test' (when AB_ASSIGNMENT='env')
TOTAL_USERS=100                  # Number of users to simulate
USE_AI_PERSONAS=true             # Enable/disable AI enhancement
```

## Usage

### Running AI-Enhanced Tests

```bash
# Run the AI-enhanced test
npx playwright test tests/playwright_sodasupply_ai_enhanced.spec.ts

# Run with specific user count
TOTAL_USERS=1000 npx playwright test tests/playwright_sodasupply_ai_enhanced.spec.ts

# Run without AI enhancement (fallback mode)
USE_AI_PERSONAS=false npx playwright test tests/playwright_sodasupply_ai_enhanced.spec.ts

# Run original test (unchanged)
npx playwright test tests/playwright_sodasupply_ab.spec.ts
```

### Running Tests in Headed Mode

```bash
# See the AI-guided interactions in action
npx playwright test tests/playwright_sodasupply_ai_enhanced.spec.ts --headed
```

## How It Works

### 1. Persona Profiles
Four personas are available:
- **Fast shopper**: Quick decisions, short sessions
- **Deliberate shopper**: Thoughtful decisions, medium sessions  
- **Browser**: Long browsing sessions, delayed conversions
- **Social influencer**: Medium sessions, social-influenced decisions

### 2. AI Behavior Generation

For each user, the AI generates:
- **Search terms**: What they might search for
- **Browsing actions**: How they navigate the site
- **Product preferences**: Types of products they prefer
- **Decision factors**: What influences their purchase decisions
- **Session duration**: How long they spend on site
- **Conversion likelihood**: Probability they'll complete purchase
- **Interaction style**: How they interact (quick/thorough/hesitant/confident)

### 3. Custom GPT Integration

The system integrates with your Eazle Test Lab GPT by:
1. Sending persona information and user context to OpenAI
2. Receiving detailed behavioral specifications
3. Translating AI responses into Playwright actions
4. Providing fallback behaviors if AI is unavailable

### 4. Realistic User Simulation

The AI-enhanced test performs:
- **Intelligent searching** based on generated search terms
- **Preference-based product selection** targeting specific product types
- **Varied browsing patterns** following AI-suggested actions
- **Decision-making simulation** using conversion likelihood
- **Timing variation** based on interaction style

## Output and Analysis

### Result Files
Tests generate detailed JSONL files in `test-results/synthetic-users/` with:
```json
{
  "userIndex": 1,
  "persona": "fast",
  "variant": "control",
  "aiBehavior": {
    "interactionStyle": "quick",
    "conversionLikelihood": 0.8,
    "searchTerms": ["energy drinks", "BODYARMOR"],
    "productPreferences": ["sports drinks"]
  },
  "finalUrl": "https://sodasupply.vercel.app/checkout",
  "status": "completed",
  "ts": "2024-01-15T10:30:00.000Z"
}
```

### Console Output
Real-time feedback includes:
- AI-generated behaviors for each user
- Search terms and browsing actions
- Decision-making process
- Conversion predictions vs actual outcomes
- Summary statistics with AI behavior analysis

## Troubleshooting

### AI Features Not Working
1. Check OpenAI API key is set correctly
2. Verify internet connectivity
3. Check API quota/billing
4. Review console logs for specific errors

### Fallback Behavior
If AI generation fails, the system automatically falls back to deterministic behaviors based on persona type.

### Performance Considerations
- AI calls add 1-3 seconds per user
- Consider reducing `TOTAL_USERS` for development
- Use `USE_AI_PERSONAS=false` for faster testing

## File Structure

```
services/
└── ai-persona-service.ts          # AI integration service

tests/
├── personas_eazle_synthetic.json  # Persona definitions (now with 4 personas)
├── playwright_sodasupply_ab.spec.ts              # Original test
└── playwright_sodasupply_ai_enhanced.spec.ts     # AI-enhanced test

test-results/
└── synthetic-users/               # Organized test results (git-ignored)
    ├── results_*_users_ai_enhanced_*.jsonl       # Raw test data
    ├── results_*_users_ai_enhanced_*.csv         # CSV exports
    └── README.md                  # Directory documentation

scripts/
├── analyze-results.js             # Rich console analysis
└── export-csv.js                  # CSV export tool
```

## Benefits

1. **More Realistic Testing**: AI generates varied, authentic user behaviors
2. **Better Coverage**: Different users exhibit different patterns, not just timing
3. **Actionable Insights**: Understanding why users convert or abandon
4. **Scalable Variation**: Thousands of unique user journeys without manual scripting
5. **Custom GPT Integration**: Leverages your specialized testing knowledge
