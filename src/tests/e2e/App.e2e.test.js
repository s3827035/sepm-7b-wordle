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
    
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    
            await page.keyboard.down('KeyG');
            await page.keyboard.down('KeyA');
            await page.keyboard.down('KeyM');
            await page.keyboard.down('KeyE');
            await page.keyboard.down('KeyR');
    
            await page.keyboard.press('Enter');
    
            await page.waitForTimeout(3000);
    
            const incorrect = await page.$(".vl-incorrect") 
    
    
            let x = "found"
    
            if (incorrect !== null) {
                console.log(x)
            }
            else {
                x = "not found"
            }
    
            expect(x).toBe("found")
        });
    
    
        
        it("check for partially-correct letter", async () => {
        
    
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    
    
            await page.keyboard.down('KeyS');
            await page.keyboard.down('KeyL');
            await page.keyboard.down('KeyI');
            await page.keyboard.down('KeyD');
            await page.keyboard.down('KeyE');
    
            await page.keyboard.press('Enter');
    
            await page.waitForTimeout(3000);
    
            const partialCorrect = await page.$(".vl-partial") 
    
            let x = "found"
    
            if (partialCorrect !== null) {
                console.log(x)
            }
            else {
                x = "not found"
            }
    
            expect(x).toBe("found")
        });
    
    
        it("check for correct letter", async () => {
        
    
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    
    
            await page.keyboard.down('KeyS');
            await page.keyboard.down('KeyL');
            await page.keyboard.down('KeyI');
            await page.keyboard.down('KeyD');
            await page.keyboard.down('KeyE');
    
            await page.keyboard.press('Enter');
    
            await page.waitForTimeout(3000);
    
            const match = await page.$(".vl-match") 
    
            let x = "found"
    
            if (match !== null) {
                console.log(x)
            }
            else {
                x = "not found"
            }
    
            expect(x).toBe("found")
            });

    
    });
    afterAll(() => browser.close());

});