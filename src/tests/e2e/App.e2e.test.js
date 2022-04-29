import puppeteer from "puppeteer";

describe("Entering word tests", () => {

    let browser;
    let page;

    beforeAll(async () => {

        browser = await puppeteer.launch({
            dumpio: true,
            headless: false
        });

        page = await browser.newPage();

        await page.goto("http://localhost:3000");

    });

    it("shows error on entering an invalid word", async () => {

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        await page.keyboard.down('KeyA');
        await page.keyboard.down('KeyB');
        await page.keyboard.down('KeyC');
        await page.keyboard.down('KeyD');
        await page.keyboard.down('KeyE');

        await page.waitForTimeout(500);

        await page.keyboard.press('Enter');

        const text = await page.$eval(".error", (e) => e.textContent);

        expect(text).toContain("Not in word list");

    });

    it("does not show any error on entering a valid word", async () => {

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        await page.waitForTimeout(1000);

        await page.keyboard.down('KeyG');
        await page.keyboard.down('KeyA');
        await page.keyboard.down('KeyM');
        await page.keyboard.down('KeyE');
        await page.keyboard.down('KeyR');

        await page.waitForTimeout(500);

        await page.keyboard.press('Enter');

        const text = await page.$eval(".error", (e) => e.textContent);

        expect(text).toBe("");

    });

    afterAll(() => browser.close());

});