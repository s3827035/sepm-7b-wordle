import Search from "../../helpers/Search";

const search = new Search();

describe("Unit Testing: Database and Search", () => {

    test('Load words and check the length', async () => {

        return search.loadWordList().then(r => {
            expect(r.length).toBe(12972);
        });

    });

    test('Check if the word exists (Positive)', async () => {
        expect(search.isWordValid("EARTH")).toBe(true);
    });

    test('Check if the word exists (Negative)', async () => {
        expect(search.isWordValid("AEDEY")).toBe(false);
    });

    test('Check if a value is pulled and not null', async () => {
        const expected = ["1", "2", "3", "4", "5"];
        expect(expected.length).toBe(search.randomWord().length)
    });

});