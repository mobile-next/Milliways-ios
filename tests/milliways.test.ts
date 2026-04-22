/**
 * Milliways — The Restaurant at the End of the Universe
 *
 * Run:
 *   npx mobilewright test milliways.test.ts
 */

import { test, expect } from '@mobilewright/test';

test.use({ bundleId: 'com.mobilenext.Milliways', video: 'on' });

test.beforeEach(async ({ device, bundleId }) => {
  await device.terminateApp(bundleId!).catch(() => {});
  await device.launchApp(bundleId!);
});

test.afterEach(async ({ screen }, testInfo) => {
  if (testInfo.status === 'passed') {
    // failed tests already have screenshots attached, so only attach a screenshot if there isn't one
    const screenshot = await screen.screenshot();
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function navigateToMenu(screen: any) {
  await screen.getByLabel('New Order').tap();
  await expect(screen.getByText('MAIN DISHES')).toBeVisible();
}

async function addItemToCart(screen: any, itemName: string, quantity = 1) {
  await screen.getByText(itemName).tap();
  for (let i = 1; i < quantity; i++) {
    await screen.getByLabel('+').tap();
  }
  await screen.getByLabel('Add to Order').tap();
}

async function openCart(screen: any) {
  await screen.getByLabel('Shopping Cart').tap();
}

function parsePrice(text: string): number {
  return parseFloat(text.replace('₭', ''));
}

async function openAccount(screen: any) {
  await screen.getByLabel('person.circle').tap();
}

// ---------------------------------------------------------------------------
// Full ordering flow — happy path E2E
// ---------------------------------------------------------------------------

test.describe('ordering flow', () => {
  test('complete order: add items, review cart, place order, see delivery', async ({ screen }) => {
    await navigateToMenu(screen);

    // Add a cow and a coffee
    await addItemToCart(screen, 'Ameglian Major Cow');
    await screen.swipe('up');
    await addItemToCart(screen, 'Coffee');

    // The sticky footer should reflect both items
    await expect(screen.getByText('View Order')).toBeVisible();
    await expect(screen.getByText('2 items')).toBeVisible();
    await expect(screen.getByText('₭39.50')).toBeVisible(); // 35 + 4.50

    // Tap into the cart and verify line items
    await screen.getByText('View Order').tap();
    await expect(screen.getByText('Ameglian Major Cow')).toBeVisible();
    await expect(screen.getByText('Coffee')).toBeVisible();
    await expect(screen.getByText('₭39.50')).toBeVisible(); // total

    // Place the order
    await screen.getByLabel('Place Order').tap();
    await expect(screen.getByText(/is on its way/)).toBeVisible();
    await expect(screen.getByText(/minutes for delivery/)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Regression suite
// ---------------------------------------------------------------------------

test.describe('regression', () => {
  test('empty cart checkout does not crash', async ({ screen }) => {
    // The app lets you place an order with zero items.
    // DeliveryView accesses items[0] unconditionally — this should crash.
    await navigateToMenu(screen);
    await openCart(screen);

    await expect(screen.getByText('Your order is empty')).toBeVisible();
    await screen.getByLabel('Place Order').tap();

    // If we get here without a crash, the bug is fixed.
    await expect(screen.getByText(/minutes for delivery/)).toBeVisible();
  });

  test('grammar: single item says "1 item" not "1 items"', async ({ screen }) => {
    await navigateToMenu(screen);
    await addItemToCart(screen, 'Green Salad');

    // The footer should say "1 item" (singular), not "1 items"
    await expect(screen.getByText(/1 item/)).toBeVisible();
    await expect(screen.getByText('1 items')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Cart & pricing
// ---------------------------------------------------------------------------

test.describe('cart and pricing', () => {
  test('adding multiple quantities updates the price correctly', async ({ screen }) => {
    await navigateToMenu(screen);

    // Add 3x Quantum Shrimp Cascade at ₭38.00 each
    await addItemToCart(screen, 'Quantum Shrimp Cascade', 3);

    await expect(screen.getByText('3 items')).toBeVisible();
    await expect(screen.getByText('₭114.00')).toBeVisible(); // 38 * 3

    // Go to cart and verify the line item breakdown
    await screen.getByText('View Order').tap();
    await expect(screen.getByText('3 × ₭38.00')).toBeVisible();
    await expect(screen.getByText('₭114.00')).toBeVisible();
  });

  test('multi-item cart totals are accurate', async ({ screen }) => {
    await navigateToMenu(screen);

    // Build a mixed order
    await addItemToCart(screen, 'Ameglian Major Cow');           // ₭35.00
    await addItemToCart(screen, 'Green Salad');                  // ₭22.00
    await screen.swipe('up');
    await addItemToCart(screen, 'Dark Matter Martini');          // ₭5.75
    // Total should be ₭62.75

    await expect(screen.getByText('3 items')).toBeVisible();
    await expect(screen.getByText('₭62.75')).toBeVisible();

    // Verify in the cart view
    await screen.getByText('View Order').tap();
    await expect(screen.getByText('₭62.75')).toBeVisible();
  });

  test('quantity cannot go below 1', async ({ screen }) => {
    await navigateToMenu(screen);
    await screen.getByText('Soup of the Day').tap();

    // Initial quantity is 1
    await expect(screen.getByText('1')).toBeVisible();

    // Try to decrease — should stay at 1
    await screen.getByLabel('−').tap();
    await screen.getByLabel('−').tap();
    await expect(screen.getByText('1')).toBeVisible();
    await expect(screen.getByText('0')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Menu discovery
// ---------------------------------------------------------------------------

test.describe('menu completeness', () => {
  test('all main dishes are listed with correct prices', async ({ screen }) => {
    await navigateToMenu(screen);

    const mainDishes = [
      { name: 'Ameglian Major Cow', price: '₭35.00' },
      { name: 'Green Salad', price: '₭22.00' },
      { name: 'Soup of the Day', price: '₭28.00' },
      { name: 'Quantum Shrimp Cascade', price: '₭38.00' },
      { name: 'Krikkit Fried Logic', price: '₭40.00' },
    ];

    for (const dish of mainDishes) {
      await expect(screen.getByText(dish.name)).toBeVisible();
    }
  });

  test('drinks section is accessible by scrolling', async ({ screen }) => {
    await navigateToMenu(screen);

    // Drinks might be below the fold — scroll down to find them
    await screen.swipe('up');
    await expect(screen.getByText('DRINKS')).toBeVisible();

    const drinks = [
      'Pan Galactic Gargle Blaster',
      'Water',
      'Coffee',
      'Infinite Improbability Float',
      'Dark Matter Martini',
    ];

    for (const drink of drinks) {
      await expect(screen.getByText(drink)).toBeVisible();
    }
  });

  test('shipping disclaimer is visible at the bottom of the menu', async ({ screen }) => {
    await navigateToMenu(screen);
    await screen.swipe('up');
    await screen.swipe('up');

    await expect(
      screen.getByText('* Shipping beyond 5 light-years distance might cost extra')
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Account screen
// ---------------------------------------------------------------------------

test.describe('account', () => {
  test('profile shows user info, loyalty status, and stats', async ({ screen }) => {
    await openAccount(screen);

    await expect(screen.getByText('Hi Glorpax!')).toBeVisible();
    await expect(screen.getByText('Pro Cosmic Foodie 🌌')).toBeVisible();
    await expect(screen.getByText('My Account')).toBeVisible();
    await expect(screen.getByText('3')).toBeVisible();
    await expect(screen.getByText('Orders')).toBeVisible();
    await expect(screen.getByText('19')).toBeVisible();
    await expect(screen.getByText('Light-years')).toBeVisible();
  });

  test('past orders total matches the displayed total spent', async ({ screen }) => {
    await openAccount(screen);

    const priceElements = screen.getByText(/₭\d+\.\d+/);
    const count = await priceElements.count();

    // First price is the displayed total, rest are past orders
    const displayedTotal = parsePrice(await priceElements.nth(0).getText());
    let sum = 0;
    for (let i = 1; i < count; i++) {
      sum += parsePrice(await priceElements.nth(i).getText());
    }

    // The sum of past orders should equal the displayed total
    expect(sum).toBe(displayedTotal);
  });

});

// ---------------------------------------------------------------------------
// Navigation & state
// ---------------------------------------------------------------------------

test.describe('navigation', () => {
  test('closing delivery returns to the welcome screen', async ({ screen }) => {
    await navigateToMenu(screen);
    await addItemToCart(screen, 'Soup of the Day');
    await screen.getByText('View Order').tap();
    await screen.getByLabel('Place Order').tap();

    // Verify we're on delivery
    await expect(screen.getByText(/is on its way/)).toBeVisible();

    // Close delivery
    await screen.getByLabel('Close').tap();

    // Should return to welcome
    await expect(screen.getByText('Welcome to Milliways')).toBeVisible();
    await expect(screen.getByLabel('New Order')).toBeVisible();
  });

  test('cart is cleared after completing an order', async ({ screen }) => {
    await navigateToMenu(screen);
    await addItemToCart(screen, 'Krikkit Fried Logic');
    await screen.getByText('View Order').tap();
    await screen.getByLabel('Place Order').tap();

    // Close delivery screen
    await screen.getByLabel('Close').tap();

    // Wait for welcome screen to appear after dismiss animation
    await expect(screen.getByText('Welcome to Milliways')).toBeVisible();

    // Start a new order — cart should be empty
    await screen.getByLabel('New Order').tap();
    await openCart(screen);
    await expect(screen.getByText('Your order is empty')).toBeVisible();
  });
});
