import puppeteer from "puppeteer";

describe("Entering word tests", () => {

    let browser;
    let page;

    beforeAll(async () => {

        jest.setTimeout(60000);

        browser = await puppeteer.launch({
            dumpio: true,
            headless: false
        });

        page = await browser.newPage();

        await page.goto("http://localhost:3000");

    });

    it("shows error on entering an invalid word", async () => {

        await page.evaluate(() => localStorage.clear());
        await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

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

        await page.evaluate(() => localStorage.clear());
        await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

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

    it("shows game over on entering 6 valid words", async () => {

        await page.evaluate(() => localStorage.clear());
        await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

        for (let i = 0; i < 6; ++i) {
            await page.waitForTimeout(200);
            await page.keyboard.down('KeyG');
            await page.keyboard.down('KeyA');
            await page.keyboard.down('KeyM');
            await page.keyboard.down('KeyE');
            await page.keyboard.down('KeyR');
            await page.keyboard.press('Enter');
        }

        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        const text = await page.$eval(".end-condition", (e) => e.textContent);
        const wordOfTheDay = await page.evaluate(() => localStorage.getItem("wordle"));

        expect(text).toContain(wordOfTheDay);

    });

    describe("Checking for correct/incorrect/partially-correct letters", () => {

        it("check for incorrect letter", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});
            await page.evaluate(() => localStorage.setItem('wordle', 'swung'));

            await page.keyboard.down('KeyG');
            await page.keyboard.down('KeyA');
            await page.keyboard.down('KeyM');
            await page.keyboard.down('KeyE');
            await page.keyboard.down('KeyR');

            await page.keyboard.press('Enter');

            await page.waitForTimeout(1000);

            const incorrect = await page.$(".vl-incorrect");

            let x = "found";

            if (incorrect == null) {
                x = "not found";
            }

            expect(x).toBe("found");

        });

        it("check for partially-correct letter", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});
            await page.evaluate(() => localStorage.setItem('wordle', 'mools'));

            await page.keyboard.down('KeyS');
            await page.keyboard.down('KeyL');
            await page.keyboard.down('KeyI');
            await page.keyboard.down('KeyD');
            await page.keyboard.down('KeyE');

            await page.keyboard.press('Enter');

            await page.waitForTimeout(1000);

            const partialCorrect = await page.$(".vl-partial");

            let x = "found";

            if (partialCorrect == null) {
                x = "not found";
            }

            expect(x).toBe("found");

        });

        it("check for correct letter", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});
            await page.evaluate(() => localStorage.setItem('wordle', 'slide'));

            await page.keyboard.down('KeyS');
            await page.keyboard.down('KeyL');
            await page.keyboard.down('KeyI');
            await page.keyboard.down('KeyD');
            await page.keyboard.down('KeyE');

            await page.keyboard.press('Enter');

            await page.waitForTimeout(1000);

            const match = await page.$(".vl-match");

            let x = "found";

            if (match == null) {
                x = "not found";
            }

            expect(x).toBe("found");

        });

    });

    describe("Testing for Statistics modal", () => {

        it("check that timer updates every seconds", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

            await page.click("a[id='statistics-link']");

            const beforeVal = await page.$eval('#time-remaining', element => element.innerHTML);

            await page.waitForTimeout(1000);

            const afterVal = await page.$eval('#time-remaining', element => element.innerHTML);

            expect(beforeVal === afterVal).toEqual(false);

        });

        it("check that the game shows 0 for all statistics played", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

            await page.click("a[id='statistics-link']");

            const playedVal = await page.$eval('#played', element => element.innerHTML);
            const winVal = await page.$eval('#win', element => element.innerHTML);
            const currentStreakVal = await page.$eval('#current-streak', element => element.innerHTML);
            const maxStreakVal = await page.$eval('#max-streak', element => element.innerHTML);

            expect(playedVal).toBe("0");
            expect(winVal).toBe("0");
            expect(currentStreakVal).toBe("0");
            expect(maxStreakVal).toBe("0");

        });

        it("check that statistics show 1 game played", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

            for (let i = 0; i < 6; ++i) {
                await page.waitForTimeout(200);
                await page.keyboard.down('KeyG');
                await page.keyboard.down('KeyA');
                await page.keyboard.down('KeyM');
                await page.keyboard.down('KeyE');
                await page.keyboard.down('KeyR');
                await page.keyboard.press('Enter');
            }

            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);

            await page.click("a[id='statistics-link']");

            const playedVal = await page.$eval('#played', element => element.innerHTML);

            expect(playedVal).toBe("1");

        });

    });

    describe("Test sharing features", () => {

        it("check if facebook share works", async () => {

            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

            for (let i = 0; i < 6; ++i) {
                await page.waitForTimeout(200);
                await page.keyboard.down('KeyG');
                await page.keyboard.down('KeyA');
                await page.keyboard.down('KeyM');
                await page.keyboard.down('KeyE');
                await page.keyboard.down('KeyR');
                await page.keyboard.press('Enter');
            }

            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);

            await page.click("a[id='statistics-link']");
            await page.click("button[id='dropdown-basic-button']");
            await page.click("a[id='fb-share']");

            expect((await browser.pages()).length).toBe(2);

        });

        it("check if twitter share works", async () => {

            await (await browser.pages())[1].bringToFront();
            await page.evaluate(() => localStorage.clear());
            await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});

            for (let i = 0; i < 6; ++i) {
                await page.waitForTimeout(200);
                await page.keyboard.down('KeyG');
                await page.keyboard.down('KeyA');
                await page.keyboard.down('KeyM');
                await page.keyboard.down('KeyE');
                await page.keyboard.down('KeyR');
                await page.keyboard.press('Enter');
            }

            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);

            await page.click("a[id='statistics-link']");
            await page.click("button[id='dropdown-basic-button']");
            await page.click("a[id='tw-share']");

            expect((await browser.pages()).length).toBe(3);

        });

    });

    afterAll(() => browser.close());

});