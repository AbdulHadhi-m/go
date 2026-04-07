const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Listen for console logs in the browser to catch frontend errors
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));

    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/login');
    
    await page.type('input[name="email"]', 'test444@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Logged in successfully!');

    // Find a trip
    console.log('Going to home...');
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('input[placeholder*="Leaving"]');
    await page.type('input[placeholder*="Leaving"]', 'Surat');
    await page.type('input[placeholder*="Going"]', 'Pune');
    const searchBtn = await page.$$('button');
    for (const b of searchBtn) {
      const text = await b.evaluate(el => el.textContent);
      if (text.includes('Search Buses')) {
        await b.click();
        break;
      }
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('On Search Results page');
    
    await page.waitForSelector('button');
    const selectSeatsBtns = await page.$$('button');
    for (const b of selectSeatsBtns) {
      const text = await b.evaluate(el => el.textContent);
      if (text.includes('Select Seats') || text.includes('Book')) {
        await b.click();
        break;
      }
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('On Seat Selection Page:', page.url());

    // Select a seat
    await page.waitForSelector('button');
    const seatBtns = await page.$$('button');
    let seatSelected = false;
    for (const btn of seatBtns) {
      const cls = await btn.evaluate(el => el.className);
      if (cls.includes('bg-slate-50')) {
        await btn.click();
        seatSelected = true;
        console.log('Seat selected!');
        break;
      }
    }

    if (!seatSelected) throw new Error('No available seats found');

    const contBtns = await page.$$('button');
    for (const cb of contBtns) {
      const ct = await cb.evaluate(el => el.textContent);
      if (ct.includes('Continue Booking')) {
        await cb.click();
        break;
      }
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('On Checkout Page:', page.url());

    // Fill passenger details
    await page.type('input[name="fullName"]', 'E2E Test User');
    await page.type('input[name="phone"]', '9999999999');
    await page.type('input[name="email"]', 'e2e@e2e.com');
    await page.type('input[name="age"]', '30');
    
    // Click Pay Now
    const allBtns = await page.$$('button');
    for (const b of allBtns) {
      const text = await b.evaluate(el => el.textContent);
      if (text.includes('Pay Now')) {
        console.log('Clicking Pay Now...');
        await b.click();
        break;
      }
    }

    // Wait and check URL or output
    await new Promise(r => setTimeout(r, 3000));
    console.log('Final URL:', page.url());
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Final Page Text snippet:', bodyText.substring(0, 500));

    await browser.close();
  } catch (error) {
    console.error('PUPPETEER E2E SCRIPT FAILED:', error.message);
    process.exit(1);
  }
})();
