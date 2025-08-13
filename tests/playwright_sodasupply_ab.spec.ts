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
  // Wait for products to load
  await page.waitForSelector('img[alt*="BODYARMOR"], img[alt*="Boylan"], img[alt*="OLIPOP"]', { timeout: 10000 });
  
  // Skip complex cart checking - just try to click everything and see what works
  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count();
  
  console.log(`Found ${buttonCount} buttons on page`);
  
  for (let i = 0; i < buttonCount; i++) {
    try {
      const button = allButtons.nth(i);
      const buttonText = await button.textContent();
      const isVisible = await button.isVisible({ timeout: 500 });
      
      // Skip obviously wrong buttons
      if (!isVisible || 
          buttonText?.includes('Continue') ||
          buttonText?.includes('Filter') ||
          buttonText?.includes('Sort') ||
          buttonText?.includes('Search') ||
          buttonText?.includes('View') ||
          buttonText?.includes('English') ||
          buttonText?.includes('Notifications') ||
          buttonText?.includes('Cart')) {
        continue;
      }
      
      console.log(`Trying button ${i}: "${buttonText?.trim() || 'no text'}"`);
      
      // Click the button
      await button.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      
      // Check if any cart badge appeared anywhere
      const badges = page.locator('[class*="badge"], [class*="Badge"]');
      const badgeCount = await badges.count();
      if (badgeCount > 0) {
        console.log(`Success! Found ${badgeCount} badges after clicking button ${i}`);
        return true;
      }
      
      // Check if cart text changed by looking for any element with cart count
      const cartElements = page.locator('text=/Cart.*[1-9]|[1-9].*Cart/');
      if (await cartElements.count() > 0) {
        console.log('Success! Found cart with items');
        return true;
      }
      
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(`Button ${i} failed: ${message}`);
      continue;
    }
  }
  
  console.log('No button successfully added items to cart');
  return false;
}

async function goToCart(page: Page) {
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Try multiple selectors with fallbacks
  const cartSelectors = [
    '[data-testid="cart-button"]',
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
