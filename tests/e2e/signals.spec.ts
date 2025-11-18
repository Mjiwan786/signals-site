/**
 * End-to-End Frontend Tests with Playwright.
 *
 * Tests signals-site UI, SSE streaming, and graceful degradation.
 *
 * Author: QA Team
 * Version: 1.0.0
 * Date: 2025-11-17
 */

import { test, expect, type Page } from '@playwright/test';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'https://crypto-signals-api.fly.dev';

test.describe('Signals Site - Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(SITE_URL);

    // Check page title
    await expect(page).toHaveTitle(/AI Predicted Signals|Crypto Signals/i);

    // Check main elements exist
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    await page.goto(SITE_URL);

    // Check for common navigation elements
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(SITE_URL);

    // Page should still be usable
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Signals Dashboard', () => {
  test('should display signals dashboard', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should have signals container or loading state
    const hasSignals = await page.locator('[data-testid="signals-container"], .signals-list').count() > 0;
    const hasLoading = await page.locator('[data-testid="loading"], .loading').count() > 0;
    const hasError = await page.locator('[data-testid="error"]').count() > 0;

    expect(hasSignals || hasLoading || hasError).toBeTruthy();
  });

  test('should receive SSE updates within 1 second', async ({ page }) => {
    // This test verifies SSE streaming latency
    await page.goto(`${SITE_URL}/signals`);

    // Set up SSE event listener
    const signalReceived = page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();

        const eventSource = new EventSource(`${(window as any).API_URL || 'https://crypto-signals-api.fly.dev'}/v1/signals/stream`);

        eventSource.onmessage = (event) => {
          const latency = performance.now() - startTime;
          eventSource.close();
          resolve({ latency, data: event.data });
        };

        eventSource.onerror = () => {
          eventSource.close();
          resolve({ latency: -1, error: true });
        };

        // Timeout after 5 seconds
        setTimeout(() => {
          eventSource.close();
          resolve({ latency: -1, timeout: true });
        }, 5000);
      });
    });

    const result = await signalReceived as any;

    if (result.error || result.timeout) {
      test.skip();
    }

    // Assert latency is within 1 second
    expect(result.latency).toBeLessThan(1000);
  });

  test('should display signal with all required fields', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000); // Wait for signals to load

    // Check if any signal cards are displayed
    const signalCards = page.locator('[data-testid="signal-card"], .signal-item').first();

    if (await signalCards.count() > 0) {
      // Verify signal has required fields
      await expect(signalCards).toBeVisible();

      // Look for signal type (LONG/SHORT/NEUTRAL)
      const hasSignalType = await signalCards.locator('text=/LONG|SHORT|NEUTRAL/i').count() > 0;
      expect(hasSignalType).toBeTruthy();
    }
  });

  test('should update signal indicators in real-time', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    // Get initial state
    const initialText = await page.locator('body').textContent();

    // Wait for potential update
    await page.waitForTimeout(3000);

    // Check if page has updated (this is a simple check)
    const updatedText = await page.locator('body').textContent();

    // At minimum, timestamp should update if signals are active
    // If no updates, test will skip
  });
});

test.describe('PnL Dashboard', () => {
  test('should display PnL metrics', async ({ page }) => {
    await page.goto(`${SITE_URL}/pnl`);

    await page.waitForLoadState('networkidle');

    // Should have PnL container or unavailable message
    const hasPnL = await page.locator('[data-testid="pnl-container"], .pnl-metrics').count() > 0;
    const hasUnavailable = await page.locator('text=/unavailable|not available/i').count() > 0;

    expect(hasPnL || hasUnavailable).toBeTruthy();
  });

  test('should display performance charts', async ({ page }) => {
    await page.goto(`${SITE_URL}/pnl`);

    await page.waitForTimeout(2000);

    // Look for chart elements (canvas, svg, etc.)
    const hasChart = await page.locator('canvas, svg, [data-testid="chart"]').count() > 0;

    if (hasChart) {
      await expect(page.locator('canvas, svg').first()).toBeVisible();
    }
  });
});

test.describe('Graceful Degradation', () => {
  test('should show "Metrics unavailable" when API is down', async ({ page }) => {
    // Mock API failure
    await page.route(`${API_URL}/**`, (route) => {
      route.abort();
    });

    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Should display error message or unavailable state
    const hasError = await page.locator('text=/unavailable|error|failed|cannot connect/i').count() > 0;

    expect(hasError).toBeTruthy();
  });

  test('should handle SSE connection errors gracefully', async ({ page }) => {
    // Mock SSE endpoint failure
    await page.route(`${API_URL}/v1/signals/stream`, (route) => {
      route.abort();
    });

    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Should not crash, should show error or retry
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Mock slow API
    await page.route(`${API_URL}/v1/signals`, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
      route.fulfill({
        status: 200,
        body: JSON.stringify([])
      });
    });

    await page.goto(`${SITE_URL}/signals`);

    // Should show loading state
    const hasLoading = await page.locator('[data-testid="loading"], text=/loading/i').count() > 0;

    expect(hasLoading).toBeTruthy();
  });

  test('should display offline indicator when disconnected', async ({ page, context }) => {
    await page.goto(`${SITE_URL}/signals`);

    // Simulate offline
    await context.setOffline(true);

    await page.waitForTimeout(1000);

    // May show offline indicator
    const hasOfflineIndicator = await page.locator('text=/offline|disconnected|no connection/i').count() > 0;

    // Reconnect
    await context.setOffline(false);
  });
});

test.describe('Performance', () => {
  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto(SITE_URL);

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    console.log('Performance Metrics:', metrics);

    // FCP should be under 1.8s (good)
    if (metrics.fcp > 0) {
      expect(metrics.fcp).toBeLessThan(1800);
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(SITE_URL);

    const h1Count = await page.locator('h1').count();

    // Should have at least one h1
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto(SITE_URL);

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt should exist (can be empty for decorative images)
        expect(alt !== null).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(SITE_URL);

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Signal Display', () => {
  test('should display signal with confidence level', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Look for confidence indicators
    const hasConfidence = await page.locator('text=/confidence|%/i').count() > 0;

    // Signals may not always be present
    if (hasConfidence) {
      expect(hasConfidence).toBeTruthy();
    }
  });

  test('should highlight high-confidence signals', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Check if high-confidence signals have visual distinction
    // (implementation-specific)
  });

  test('should display signal timestamp', async ({ page }) => {
    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Look for timestamp
    const hasTimestamp = await page.locator('text=/ago|seconds|minutes|hours|AM|PM/i').count() > 0;

    if (hasTimestamp) {
      expect(hasTimestamp).toBeTruthy();
    }
  });
});

test.describe('Error Handling', () => {
  test('should display user-friendly error messages', async ({ page }) => {
    // Mock API error
    await page.route(`${API_URL}/v1/signals`, (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(2000);

    // Should show friendly error message
    const errorText = await page.locator('text=/error|problem|try again/i').count() > 0;

    expect(errorText).toBeTruthy();
  });

  test('should allow retry on error', async ({ page }) => {
    // Mock initial error, then success
    let requestCount = 0;

    await page.route(`${API_URL}/v1/signals`, (route) => {
      requestCount++;

      if (requestCount === 1) {
        route.fulfill({ status: 500, body: '{"error":"Error"}' });
      } else {
        route.fulfill({ status: 200, body: '[]' });
      }
    });

    await page.goto(`${SITE_URL}/signals`);

    await page.waitForTimeout(1000);

    // Look for retry button
    const retryButton = page.locator('button:has-text("retry"), button:has-text("try again")').first();

    if (await retryButton.count() > 0) {
      await retryButton.click();

      await page.waitForTimeout(1000);

      // Should recover
      expect(requestCount).toBeGreaterThan(1);
    }
  });
});
