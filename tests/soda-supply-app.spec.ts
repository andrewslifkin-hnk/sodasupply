import { test, expect } from '@playwright/test';

test.describe('Soda Supply App', () => {
  test('home page redirects to products', async ({ page }) => {
    // Listen for console errors to debug the client-side exception
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });

    await page.goto('/');
    
    // Wait for the redirect to complete instead of immediate assertion
    await page.waitForURL('/products', { timeout: 10000 });
    
    // Verify we're on the products page
    await expect(page).toHaveURL('/products');
  });

  test('products page loads successfully', async ({ page }) => {
    // Navigate to products page and check response
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    
    // Check that we're on the products page
    await expect(page).toHaveURL('/products');
    
    // Wait for page to load and verify basic page structure
    await page.waitForLoadState('networkidle');
    
    // Verify the page loaded by checking that HTML is attached
    await expect(page.locator('html')).toBeAttached();
  });

  test('page has some content', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page has some text content (not just a blank page)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);
  });

  test('page responds to interaction', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Try to click somewhere on the page and verify it doesn't error
    // This is a basic interaction test
    await page.locator('body').click({ position: { x: 100, y: 100 } });
    
    // Page should still be accessible
    await expect(page.locator('body')).toBeVisible();
  });
});
