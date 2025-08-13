// playwright_sodasupply_ab.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import type { Page } from '@playwright/test';

type Persona = {
  persona_key: string;
  label: string;
  behaviours: {
    session_length: 'short' | 'medium' | 'long';
    pages_common: string[];
    conversion_latency_hours: number;
  };
};

const personasPath = path.join(__dirname, 'personas_eazle_synthetic.json');
const personas = JSON.parse(fs.readFileSync(personasPath, 'utf-8')) as Persona[];

const BASE_URL = process.env.EAZLE_BASE_URL || 'https://sodasupply.vercel.app/products';
const ASSIGNMENT = process.env.AB_ASSIGNMENT || 'env'; // 'env' | 'random'
const VARIANT_ENV = process.env.AB_VARIANT || 'control'; // if ASSIGNMENT='env'
const RUNS = parseInt(process.env.RUNS || '1', 10);

function pickVariant(): 'control' | 'test' {
  if (ASSIGNMENT === 'random') return Math.random() < 0.5 ? 'control' : 'test';
  return (VARIANT_ENV === 'test' ? 'test' : 'control');
}

async function waitBySessionLength(page: Page, length: 'short'|'medium'|'long') {
  const ms = length === 'short' ? 400 : length === 'medium' ? 1200 : 2400;
  await page.waitForTimeout(ms);
}

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
  // Wait for any recognizable product imagery to indicate catalog loaded
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
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Try multiple selectors with fallbacks
  const cartSelectors = [
    '[data-testid="cart-button"]',
    // Legacy/mobile fallback if running against environments that expose a mobile cart test id
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
        // Wait for cart sheet/dialog to appear
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
        return;
      }
    } catch {}
  }
  
  throw new Error('No cart button found with any selector');
}

async function checkout(page: Page) {
  // Ensure cart dialog is open
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  
  // Check if cart has items before trying to checkout
  const cartTitle = page.getByRole('dialog').locator('h2, [role="heading"]');
  const titleText = await cartTitle.textContent();
  
  if (titleText?.includes('(0 products)') || titleText?.includes('empty')) {
    throw new Error('Cart is empty - cannot checkout');
  }
  
  // Try multiple checkout button selectors
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

test.describe('SodaSupply – Synthetic A/B journeys', () => {
  test.describe.configure({ timeout: 90000 });
  for (const persona of personas) {
    test(`${persona.label}`, async ({ page }) => {
      const results: any[] = [];
      for (let i = 0; i < RUNS; i++) {
        const variant = pickVariant();
        const url = `${BASE_URL}${BASE_URL.includes('?') ? '&' : '?'}ab_variant=${variant}&persona=${persona.persona_key}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/products/);
        await waitBySessionLength(page, persona.behaviours.session_length);
        
        const addedToCart = await addFirstProductToCart(page);
        if (!addedToCart) {
          throw new Error('Failed to add any product to cart');
        }
        
        await waitBySessionLength(page, persona.behaviours.session_length);
        await goToCart(page);
        await waitBySessionLength(page, persona.behaviours.session_length);
        await checkout(page);
        results.push({ persona: persona.persona_key, variant, finalUrl: page.url(), ts: new Date().toISOString() });
      }
      const out = results.map(r => JSON.stringify(r)).join('\n') + '\n';
      fs.appendFileSync(`./results_${persona.persona_key}.jsonl`, out, { encoding: 'utf-8' });
    });
  }
});
