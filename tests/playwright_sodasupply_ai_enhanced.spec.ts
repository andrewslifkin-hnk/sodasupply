// playwright_sodasupply_ai_enhanced.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import type { Page } from '@playwright/test';
import { AIPersonaService, type PersonaProfile, type AIPersonaBehavior } from '../services/ai-persona-service';

const personasPath = path.join(__dirname, 'personas_eazle_synthetic.json');
const personas = JSON.parse(fs.readFileSync(personasPath, 'utf-8')) as PersonaProfile[];

const BASE_URL = process.env.EAZLE_BASE_URL || 'https://sodasupply.vercel.app/products';
const ASSIGNMENT = process.env.AB_ASSIGNMENT || 'env'; // 'env' | 'random'
const VARIANT_ENV = process.env.AB_VARIANT || 'control'; // if ASSIGNMENT='env'
const TOTAL_USERS = parseInt(process.env.TOTAL_USERS || '100', 10);
const USE_AI_PERSONAS = process.env.USE_AI_PERSONAS !== 'false'; // default to true

const aiPersonaService = new AIPersonaService();

function pickVariant(): 'control' | 'test' {
  if (ASSIGNMENT === 'random') return Math.random() < 0.5 ? 'control' : 'test';
  return (VARIANT_ENV === 'test' ? 'test' : 'control');
}

function pickPersona(): PersonaProfile {
  // Randomly distribute users across all available personas
  const randomIndex = Math.floor(Math.random() * personas.length);
  return personas[randomIndex];
}

async function waitByBehavior(page: Page, behavior: AIPersonaBehavior, baseLength: 'short'|'medium'|'long') {
  let baseDuration: number;
  
  if (USE_AI_PERSONAS && behavior.sessionDuration) {
    // Use AI-generated duration but scale it down for test speed
    baseDuration = Math.min(behavior.sessionDuration * 100, 3000); // Scale down but cap at 3 seconds
  } else {
    // Fallback to original logic
    baseDuration = baseLength === 'short' ? 400 : baseLength === 'medium' ? 1200 : 2400;
  }
  
  // Add some randomness based on interaction style
  const styleMultiplier = behavior.interactionStyle === 'quick' ? 0.7 : 
                          behavior.interactionStyle === 'hesitant' ? 1.5 : 1.0;
  
  const finalDuration = Math.round(baseDuration * styleMultiplier);
  await page.waitForTimeout(finalDuration);
}

async function performAIGuidedSearch(page: Page, behavior: AIPersonaBehavior): Promise<boolean> {
  if (!USE_AI_PERSONAS || !behavior.searchTerms?.length) {
    return false;
  }

  try {
    // Look for search input
    const searchSelectors = [
      '[data-testid="search-input"]',
      'input[type="search"]',
      'input[placeholder*="search" i]',
      'input[aria-label*="search" i]'
    ];

    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      if (await searchInput.isVisible({ timeout: 2000 })) {
        const searchTerm = behavior.searchTerms[Math.floor(Math.random() * behavior.searchTerms.length)];
        console.log(`Searching for: ${searchTerm}`);
        
        await searchInput.click();
        await searchInput.fill(searchTerm);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        return true;
      }
    }
  } catch (error) {
    console.log('Search attempt failed:', error);
  }
  
  return false;
}

async function simulateBrowsingBehavior(page: Page, behavior: AIPersonaBehavior) {
  if (!USE_AI_PERSONAS || !behavior.browsingActions?.length) {
    return;
  }

  // Simulate some browsing actions based on AI behavior
  const actions = behavior.browsingActions;
  const numActions = Math.min(actions.length, 3); // Limit to 3 actions for test speed
  
  for (let i = 0; i < numActions; i++) {
    const action = actions[i];
    console.log(`Performing browsing action: ${action}`);
    
    try {
      if (action.includes('scroll') || action.includes('browse')) {
        await page.evaluate(() => window.scrollBy(0, Math.random() * 500 + 200));
        await page.waitForTimeout(500);
      } else if (action.includes('filter') || action.includes('category')) {
        // Try to interact with filters
        const filterButton = page.locator('button').filter({ hasText: /filter|category/i }).first();
        if (await filterButton.isVisible({ timeout: 1000 })) {
          await filterButton.click();
          await page.waitForTimeout(300);
        }
      } else if (action.includes('compare') || action.includes('details')) {
        // Try to view product details
        const productLinks = page.locator('a').filter({ hasText: /view|details|more/i }).first();
        if (await productLinks.isVisible({ timeout: 1000 })) {
          await productLinks.click();
          await page.waitForTimeout(500);
          await page.goBack();
        }
      }
    } catch (error) {
      console.log(`Browsing action "${action}" failed:`, error);
    }
  }
}

async function addProductBasedOnPreferences(page: Page, behavior: AIPersonaBehavior): Promise<boolean> {
  try {
    // Wait for products to load
    await page.waitForSelector('img[alt*="BODYARMOR" i], img[alt*="Boylan" i], img[alt*="OLIPOP" i]', { timeout: 10000 });
    
    // If AI has product preferences, try to find matching products first
    if (USE_AI_PERSONAS && behavior.productPreferences?.length) {
      for (const preference of behavior.productPreferences) {
        console.log(`Looking for products matching preference: ${preference}`);
        
        // Try to find products matching preferences
        const preferenceRegex = new RegExp(preference, 'i');
        const matchingProduct = page.locator(`button:has-text("${preference}"), [alt*="${preference}" i]`).first();
        
        if (await matchingProduct.isVisible({ timeout: 2000 })) {
          const addButton = page.locator('[data-testid="add-to-cart"]:not([disabled])').first();
          if (await addButton.isVisible({ timeout: 2000 })) {
            await addButton.click();
            console.log(`Added product matching preference: ${preference}`);
            return true;
          }
        }
      }
    }
    
    // Fallback to original add to cart logic
    return await addFirstProductToCart(page);
  } catch (error) {
    console.log('AI-guided product selection failed, using fallback:', error);
    return await addFirstProductToCart(page);
  }
}

async function makeDecisionBasedOnFactors(page: Page, behavior: AIPersonaBehavior): Promise<boolean> {
  if (!USE_AI_PERSONAS || !behavior.decisionFactors?.length) {
    return true; // Proceed with checkout
  }

  // Simulate decision-making based on factors
  const factors = behavior.decisionFactors;
  console.log(`Decision factors: ${factors.join(', ')}`);
  
  // If price is a factor, maybe hesitate a bit more
  if (factors.some(f => f.toLowerCase().includes('price'))) {
    await page.waitForTimeout(1000); // Extra hesitation for price-conscious users
  }
  
  // Use conversion likelihood to determine if user will actually checkout
  const willConvert = Math.random() < behavior.conversionLikelihood;
  console.log(`Conversion likelihood: ${behavior.conversionLikelihood}, Will convert: ${willConvert}`);
  
  return willConvert;
}

// Keep original helper functions
async function clickAny(page: Page, locators: Array<ReturnType<typeof page.locator>>) {
  for (const locator of locators) {
    const target = locator.first();
    if (await target.count()) {
      try {
        await target.click({ timeout: 3000 });
        return true;
      } catch {}
    }
  }
  return false;
}

async function addFirstProductToCart(page: Page): Promise<boolean> {
  // Prefer deterministic selector in our app; fall back if unavailable
  try {
    const addToCart = page.locator('[data-testid="add-to-cart"]:not([disabled])');
    await addToCart.first().waitFor({ state: 'attached', timeout: 15000 });
    await addToCart.first().scrollIntoViewIfNeeded();
    await expect(addToCart.first()).toBeVisible({ timeout: 5000 });
    await addToCart.first().click({ timeout: 3000 });
    return true;
  } catch {}

  // Fallback heuristic for environments without our test ids
  await page.waitForSelector('img[alt*="BODYARMOR" i], img[alt*="Boylan" i], img[alt*="OLIPOP" i]', { timeout: 10000 });

  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count();
  for (let i = 0; i < buttonCount; i++) {
    try {
      const button = allButtons.nth(i);
      const buttonText = (await button.textContent())?.trim() || '';
      const isVisible = await button.isVisible({ timeout: 500 });
      if (!isVisible) continue;
      if (
        buttonText.includes('Continue') ||
        buttonText.includes('Filter') ||
        buttonText.includes('Sort') ||
        buttonText.includes('Search') ||
        buttonText.includes('View') ||
        buttonText.includes('English') ||
        buttonText.includes('Notifications') ||
        buttonText.includes('Cart')
      ) continue;

      await button.scrollIntoViewIfNeeded();
      await button.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(`Heuristic button ${i} failed: ${message}`);
      continue;
    }
  }

  return false;
}

async function goToCart(page: Page) {
  await page.waitForLoadState('networkidle');
  
  const cartSelectors = [
    '[data-testid="cart-button"]',
    '[data-testid*="mobile-cart" i]',
    'button:has-text("Cart")',
    'button[aria-label*="cart" i]',
    'button:has([data-testid*="cart"])',
    'button:has(svg):has-text("Cart")'
  ];
  
  for (const selector of cartSelectors) {
    const button = page.locator(selector).first();
    try {
      if (await button.isVisible({ timeout: 1000 })) {
        await button.click();
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
        return;
      }
    } catch {}
  }
  
  throw new Error('No cart button found with any selector');
}

async function checkout(page: Page) {
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  
  const cartTitle = page.getByRole('dialog').locator('h2, [role="heading"]');
  const titleText = await cartTitle.textContent();
  
  if (titleText?.includes('(0 products)') || titleText?.includes('empty')) {
    throw new Error('Cart is empty - cannot checkout');
  }
  
  const checkoutSelectors = [
    '[data-testid="checkout"]',
    'button:has-text("Checkout")',
    'button:has-text("checkout")',
    'button[aria-label*="checkout" i]'
  ];
  
  for (const selector of checkoutSelectors) {
    const button = page.locator(selector);
    if (await button.isVisible({ timeout: 2000 })) {
      await button.click();
      return;
    }
  }
  
  throw new Error('No checkout button found');
}

test.describe('SodaSupply – AI-Enhanced Synthetic A/B journeys', () => {
  test.describe.configure({ timeout: 120000 }); // Increased timeout for AI calls
  
  test(`Simulate ${TOTAL_USERS} AI-enhanced users across all personas`, async ({ page }) => {
    const results: any[] = [];
    
    console.log(`AI Personas enabled: ${USE_AI_PERSONAS}`);
    console.log(`OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
    
    for (let userIndex = 0; userIndex < TOTAL_USERS; userIndex++) {
      const persona = pickPersona();
      const variant = pickVariant();
      
      // Generate AI behavior for this user
      let aiBehavior: AIPersonaBehavior;
      try {
        aiBehavior = await aiPersonaService.generatePersonaBehavior(persona, userIndex + 1);
        console.log(`User ${userIndex + 1}/${TOTAL_USERS}: ${persona.label} (${variant}) - AI Style: ${aiBehavior.interactionStyle}`);
      } catch (error) {
        console.warn(`Failed to generate AI behavior for user ${userIndex + 1}:`, error);
        aiBehavior = {
          browsingActions: ['browse products'],
          decisionFactors: ['price'],
          sessionDuration: 60,
          conversionLikelihood: 0.5,
          interactionStyle: 'quick'
        };
      }
      
      const url = `${BASE_URL}${BASE_URL.includes('?') ? '&' : '?'}ab_variant=${variant}&persona=${persona.persona_key}`;
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/products/);
        
        // Initial wait based on AI behavior
        await waitByBehavior(page, aiBehavior, persona.behaviours.session_length);
        
        // Perform AI-guided search if applicable
        await performAIGuidedSearch(page, aiBehavior);
        
        // Simulate AI-guided browsing behavior
        await simulateBrowsingBehavior(page, aiBehavior);
        
        // Add product based on AI preferences
        const addedToCart = await addProductBasedOnPreferences(page, aiBehavior);
        if (!addedToCart) {
          console.warn(`User ${userIndex + 1}: Failed to add product to cart`);
          results.push({ 
            userIndex: userIndex + 1,
            persona: persona.persona_key, 
            variant, 
            aiBehavior: USE_AI_PERSONAS ? aiBehavior : null,
            finalUrl: page.url(), 
            status: 'failed_add_to_cart',
            ts: new Date().toISOString() 
          });
          continue;
        }
        
        await waitByBehavior(page, aiBehavior, persona.behaviours.session_length);
        await goToCart(page);
        await waitByBehavior(page, aiBehavior, persona.behaviours.session_length);
        
        // AI-guided decision making
        const willCheckout = await makeDecisionBasedOnFactors(page, aiBehavior);
        if (!willCheckout) {
          console.log(`User ${userIndex + 1}: AI decided not to checkout (conversion likelihood: ${aiBehavior.conversionLikelihood})`);
          results.push({ 
            userIndex: userIndex + 1,
            persona: persona.persona_key, 
            variant, 
            aiBehavior: USE_AI_PERSONAS ? aiBehavior : null,
            finalUrl: page.url(), 
            status: 'abandoned_cart',
            ts: new Date().toISOString() 
          });
          continue;
        }
        
        await checkout(page);
        
        results.push({ 
          userIndex: userIndex + 1,
          persona: persona.persona_key, 
          variant, 
          aiBehavior: USE_AI_PERSONAS ? aiBehavior : null,
          finalUrl: page.url(), 
          status: 'completed',
          ts: new Date().toISOString() 
        });
      } catch (error) {
        console.warn(`User ${userIndex + 1}: Test failed -`, error);
        results.push({ 
          userIndex: userIndex + 1,
          persona: persona.persona_key, 
          variant, 
          aiBehavior: USE_AI_PERSONAS ? aiBehavior : null,
          finalUrl: page.url(), 
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          ts: new Date().toISOString() 
        });
      }
    }
    
    // Write results to organized directory with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const aiSuffix = USE_AI_PERSONAS ? '_ai_enhanced' : '';
    const outputFile = `./test-results/synthetic-users/results_${TOTAL_USERS}_users${aiSuffix}_${timestamp}.jsonl`;
    const output = results.map(r => JSON.stringify(r)).join('\n') + '\n';
    fs.writeFileSync(outputFile, output, { encoding: 'utf-8' });
    
    // Log summary statistics
    const personaCounts = results.reduce((acc, r) => {
      acc[r.persona] = (acc[r.persona] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const variantCounts = results.reduce((acc, r) => {
      acc[r.variant] = (acc[r.variant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusCounts = results.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // AI behavior analysis
    if (USE_AI_PERSONAS) {
      const interactionStyleCounts = results
        .filter(r => r.aiBehavior?.interactionStyle)
        .reduce((acc, r) => {
          acc[r.aiBehavior.interactionStyle] = (acc[r.aiBehavior.interactionStyle] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const avgConversionLikelihood = results
        .filter(r => r.aiBehavior?.conversionLikelihood)
        .reduce((sum, r) => sum + r.aiBehavior.conversionLikelihood, 0) / 
        results.filter(r => r.aiBehavior?.conversionLikelihood).length;
      
      console.log('\n=== AI Behavior Analysis ===');
      console.log('Interaction style distribution:', interactionStyleCounts);
      console.log('Average conversion likelihood:', avgConversionLikelihood.toFixed(3));
    }
    
    console.log('\n=== Test Summary ===');
    console.log(`Total users simulated: ${results.length}`);
    console.log(`AI Enhancement: ${USE_AI_PERSONAS ? 'Enabled' : 'Disabled'}`);
    console.log('Persona distribution:', personaCounts);
    console.log('Variant distribution:', variantCounts);
    console.log('Status distribution:', statusCounts);
    console.log(`Results written to: ${outputFile}`);
  });
});
