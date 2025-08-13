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
  
  // Find product cards and their buttons - target the button next to each product
  const productCards = page.locator('main').locator('img[alt*="BODYARMOR"], img[alt*="Boylan"], img[alt*="OLIPOP"]');
  const productCount = await productCards.count();
  
  for (let i = 0; i < Math.min(productCount, 3); i++) {
    try {
      const productImage = productCards.nth(i);
      
      // Find buttons near this product (should be 2 buttons per product based on snapshot)
      const productContainer = productImage.locator('xpath=ancestor::*[position()<=3]').first();
      const buttons = productContainer.locator('button').filter({ hasNot: page.locator('img[alt*="heart"], img[alt*="favorite"]') });
      const buttonCount = await buttons.count();
      
      // Try the last button (usually the add-to-cart)
      if (buttonCount > 0) {
        const addButton = buttons.last();
        if (await addButton.isVisible({ timeout: 1000 })) {
          // First click: opens the stepper
          await addButton.click();
          await page.waitForTimeout(500);
          
          // Second click: click the same button again or find new plus button
          const expandedButtons = productContainer.locator('button');
          const newButtonCount = await expandedButtons.count();
          
          if (newButtonCount > buttonCount) {
            // New buttons appeared (stepper), click the last one (plus)
            await expandedButtons.last().click();
          } else {
            // No stepper appeared, click the same button again
            await addButton.click();
          }
          
          // Wait for cart to update
          await page.waitForTimeout(500);
          return true;
        }
      }
    } catch {}
  }
  
  // Fallback: try any button that might be add-to-cart
  try {
    const allProductButtons = page.locator('main button').filter({ hasNot: page.locator('img[alt*="heart"], img[alt*="favorite"]') });
    const count = await allProductButtons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = allProductButtons.nth(i);
      if (await button.isVisible({ timeout: 500 })) {
        await button.click();
        await page.waitForTimeout(300);
        await button.click(); // Second click
        await page.waitForTimeout(500);
        return true;
      }
    }
  } catch {}
  
  return false;
}

async function goToCart(page: Page) {
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Try multiple selectors with fallbacks
  const cartSelectors = [
    '[data-testid="cart-button"]',
    '[data-testid="mobile-cart-button"]',
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
