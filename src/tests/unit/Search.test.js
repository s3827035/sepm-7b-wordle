import Search from "../../helpers/Search";

const search = new Search();

describe("Unit Testing: Database and Search", () => {

    test('Load words and check the length', async () => {

        return search.loadWordList().then(r => {
            expect(r.length).toBe(77831);
        });

    });

    test('Check if the word exists (Positive)', async () => {
        expect(search.isWordValid("EARTH")).toBe(true);
    });

    test('Check if the word exists (Negative)', async () => {
        expect(search.isWordValid("AEDEY")).toBe(false);
    });

});