/**
 * Milliways — The Restaurant at the End of the Universe
 *
 * Run:
 *   npx mobilewright test scripts/milliways.test.ts
 */

import { test, expect } from '@mobilewright/test';

test.use({ bundleId: 'com.mobilenext.Milliways', video: 'on' });

test.beforeEach(async ({ device, bundleId }) => {
  await device.terminateApp(bundleId!).catch(() => {});
  await device.launchApp(bundleId!);
});

test.afterEach(async ({ screen }, testInfo) => {
  const screenshot = await screen.screenshot();
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
});

test('home screen shows welcome message and New Order button', async ({ screen }) => {
  await expect(screen.getByText('Welcome to Milliways')).toBeVisible();
  await expect(screen.getByLabel('New Order')).toBeVisible();
});

test('menu displays main dishes with prices', async ({ screen }) => {
  await screen.getByLabel('New Order').tap();

  await expect(screen.getByText('MAIN DISHES')).toBeVisible();
  await expect(screen.getByText('Ameglian Major Cow')).toBeVisible();
  await expect(screen.getByText('Green Salad')).toBeVisible();
  await expect(screen.getByText('Soup of the Day')).toBeVisible();
});

test('tapping a dish opens its detail page', async ({ screen }) => {
  await screen.getByLabel('New Order').tap();
  await screen.getByText('Ameglian Major Cow').tap();

  await expect(screen.getByText('Ameglian Major Cow')).toBeVisible();
  await expect(screen.getByText('The finest cut from a cow that wants to be eaten')).toBeVisible();
  await expect(screen.getByText('₭35.00')).toBeVisible();
  await expect(screen.getByLabel('Add to Order')).toBeVisible();
});

test('can add item to cart and see order summary', async ({ screen }) => {
  await screen.getByLabel('New Order').tap();
  await screen.getByText('Ameglian Major Cow').tap();
  await screen.getByLabel('Add to Order').tap();

  await expect(screen.getByText('View Order')).toBeVisible();
  await expect(screen.getByText('1 items')).toBeVisible();
  await expect(screen.getByText('₭35.00')).toBeVisible();
});

test('can increase item quantity before adding to cart', async ({ screen }) => {
  await screen.getByLabel('New Order').tap();
  await screen.getByText('Green Salad').tap();

  await expect(screen.getByText('1')).toBeVisible();
  await screen.getByLabel('+').tap();
  await expect(screen.getByText('2')).toBeVisible();

  await screen.getByLabel('Add to Order').tap();
  await expect(screen.getByText('2 items')).toBeVisible();
});

test('checking out an empty cart shows delivery estimate', async ({ screen }) => {
  await screen.getByLabel('New Order').tap();
  await screen.getByLabel('Shopping Cart').tap();
  await screen.getByLabel('Place Order').tap();

  await expect(screen.getByText('minutes for delivery')).toBeVisible();
});
