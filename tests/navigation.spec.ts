
import { test, expect } from '@playwright/test';

const navItems = [
  { label: 'Home', testId: 'nav-hero' },
  { label: 'About', testId: 'nav-about' },
  { label: 'Skills', testId: 'nav-skills' },
  { label: 'Projects', testId: 'nav-projects' },
  { label: 'Contact', testId: 'nav-contact' },
];

//helper function
async function waitForScrollTo(page, selector, timeout = 10000) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= -50 && rect.top <= 50;
    },
    selector,
    { timeout }
  );
}

test.describe('Navbar scroll behavior', () => {
  for (const { label, testId } of navItems) {
    test(`scrolls to ${label} section`, async ({ page }) => {
      await page.goto('/');

      const selector = `[data-testid="${testId}"]`;

      // Always start scrolled at the very top to ensure consistency
      await page.evaluate(() => window.scrollTo(0, 0));

      // If testing Home, first scroll away to About, wait for it to settle
      if (label === 'Home') {
        await page.click('nav >> text=About');
        await waitForScrollTo(page, '[data-testid="nav-about"]');
      }

      // Now click the nav item under test
      await page.click(`nav >> text=${label}`);

      // Wait for the scroll to complete to the target section
      await waitForScrollTo(page, selector);

      // Verify the section is in the viewport
      const section = page.locator(selector);
      const isInViewport = await section.evaluate(el => {
        const top = el.getBoundingClientRect().top;
        return top >= -80 && top <= 120;
      });

      expect(isInViewport).toBe(true);
    });
  }
});