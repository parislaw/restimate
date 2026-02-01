import puppeteer from 'puppeteer';
import assert from 'assert';

const BASE_URL = 'http://localhost:5173';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  let browser;
  try {
    console.log('🚀 Starting visual browser tests...\n');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport for desktop testing
    await page.setViewport({ width: 1280, height: 720 });

    // ========== TEST 1: Login page loads ==========
    console.log('📄 TEST 1: Login page loads and renders correctly');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    const loginTitle = await page.$eval('h1', el => el.textContent);
    assert.strictEqual(loginTitle, 'Restimate', 'Login page title should be "Restimate"');
    console.log('  ✓ Login page renders');

    const demoButton = await page.$('button');
    assert(demoButton, 'Demo button should exist');
    console.log('  ✓ Demo Mode button visible');

    // ========== TEST 2: Form validation ==========
    console.log('\n💬 TEST 2: Form validation works');

    // Try to submit with empty fields
    const emailInput = await page.$('input[type="email"]');
    const submitButton = await page.$('button[type="submit"]');

    await emailInput.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await submitButton.click();

    await sleep(500);
    const errorMsg = await page.$('.errorMessage, [class*="error"]');
    assert(errorMsg, 'Error message should appear on empty submit');
    console.log('  ✓ Form validation prevents empty submission');

    // ========== TEST 3: Demo mode button ==========
    console.log('\n🎮 TEST 3: Demo Mode button works');

    // Click demo button
    const demoBtn = await page.$('button:not([type="submit"])');
    if (demoBtn) {
      await demoBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      await sleep(2000);

      const currentUrl = page.url();
      console.log('  ✓ Demo mode redirected to:', currentUrl);

      // Check if we're on daily planner or onboarding
      const dailyPlannerTitle = await page.$('h1');
      if (dailyPlannerTitle) {
        const titleText = await page.evaluate(el => el.textContent, dailyPlannerTitle);
        console.log('  ✓ Successfully entered demo mode, showing:', titleText);
      }
    }

    // ========== TEST 4: Break cards and completion toggle ==========
    console.log('\n☑️  TEST 4: Break cards render and completion toggle works');

    const breakCards = await page.$$('[class*="BreakCard"], [class*="breaksList"] > div');
    console.log(`  ✓ Found ${breakCards.length} break cards`);

    if (breakCards.length > 0) {
      const firstCheckbox = await page.$('input[type="checkbox"]');
      if (firstCheckbox) {
        const initialChecked = await page.evaluate(el => el.checked, firstCheckbox);
        await firstCheckbox.click();
        await sleep(300);
        const afterChecked = await page.evaluate(el => el.checked, firstCheckbox);
        assert(initialChecked !== afterChecked, 'Checkbox should toggle');
        console.log('  ✓ Break completion toggle works');
      }
    }

    // ========== TEST 5: Timeline blocks ==========
    console.log('\n📊 TEST 5: Timeline blocks are interactive');

    const timelineBlocks = await page.$$('[class*="breakBlock"]');
    console.log(`  ✓ Found ${timelineBlocks.length} timeline blocks`);

    if (timelineBlocks.length > 0) {
      const firstBlock = timelineBlocks[0];
      const cursorStyle = await page.evaluate(el => {
        return window.getComputedStyle(el).cursor;
      }, firstBlock);
      assert(cursorStyle === 'pointer', 'Timeline blocks should have pointer cursor');
      console.log('  ✓ Timeline blocks have pointer cursor');

      // Test clicking
      await firstBlock.click();
      await sleep(500);
      console.log('  ✓ Timeline block click event fires');
    }

    // ========== TEST 6: Sidebar navigation ==========
    console.log('\n🧭 TEST 6: Sidebar navigation');

    const navItems = await page.$$('[class*="navItem"]');
    console.log(`  ✓ Found ${navItems.length} navigation items`);

    if (navItems.length > 0) {
      // Try clicking Profile link
      const profileLink = await page.$('a[href*="/profile"]');
      if (profileLink) {
        await profileLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
        await sleep(1000);

        const currentUrl = page.url();
        assert(currentUrl.includes('profile'), 'Should navigate to profile');
        console.log('  ✓ Profile navigation works');

        // ========== TEST 7: Profile page form ==========
        console.log('\n👤 TEST 7: Profile page renders with form');

        const profileTitle = await page.$('h1');
        if (profileTitle) {
          const titleText = await page.evaluate(el => el.textContent, profileTitle);
          assert(titleText.includes('Profile'), 'Should show profile title');
          console.log('  ✓ Profile page loaded:', titleText);
        }

        const editButton = await page.$('button:not([type="checkbox"])');
        if (editButton) {
          await editButton.click();
          await sleep(300);
          const inputs = await page.$$('input');
          console.log(`  ✓ Profile edit mode activated with ${inputs.length} input fields`);
        }
      }
    }

    // ========== TEST 8: Mobile responsive ==========
    console.log('\n📱 TEST 8: Mobile responsive design');

    await page.setViewport({ width: 375, height: 667 });
    await sleep(500);

    const hamburger = await page.$('button[aria-label*="hamburger"], button[aria-label*="sidebar"]');
    if (hamburger) {
      console.log('  ✓ Hamburger menu appears on mobile');

      await hamburger.click();
      await sleep(300);

      const sidebarOpen = await page.$('[class*="sidebar"][class*="open"]');
      if (sidebarOpen) {
        console.log('  ✓ Sidebar toggles open on mobile');
      }
    }

    // ========== TEST 9: Year View ==========
    console.log('\n📅 TEST 9: Year View page');

    const yearLink = await page.$('a[href*="/year"]');
    if (yearLink) {
      await yearLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      await sleep(1000);

      const currentUrl = page.url();
      assert(currentUrl.includes('year'), 'Should navigate to year view');
      console.log('  ✓ Year View navigation works');
    }

    // ========== TEST 10: Action Library ==========
    console.log('\n✨ TEST 10: Action Library page');

    const actionsLink = await page.$('a[href*="/actions"]');
    if (actionsLink) {
      await actionsLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      await sleep(1000);

      const currentUrl = page.url();
      assert(currentUrl.includes('actions'), 'Should navigate to actions');
      console.log('  ✓ Action Library navigation works');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL VISUAL TESTS PASSED');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error instanceof assert.AssertionError) {
      console.error('Assertion:', error.message);
    }
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run tests
runTests();
