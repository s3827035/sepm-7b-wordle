import Storage from "../../helpers/Storage";

const storage = new Storage();

describe("Unit Testing: Database and Search", () => {

    test('Store a word in the localstorage', async () => {

        storage.set("name", "RMIT");

        let x = storage.get("name");

        expect(x).toBe("RMIT");

    });

    test('load a non-existent value from the localstorage', async () => {

        let x = storage.get("attempts");

        expect(x).toBe(null);

    });

    test('load an existing value from the localstorage', async () => {

        let x = storage.get("name");

        expect(x).toBe("RMIT");

    });

});