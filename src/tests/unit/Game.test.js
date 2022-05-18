import Game from "../../helpers/Game";

const game = new Game();

describe("Unit Testing: Game Functionality", () => {

    test('compare with word of the day - MATCH', async () => {

        let x = game.setTodayWord("hello");

        let getPlayerWord = game.compareWithTodayWord("hello");

        let output = ["MATCH"];

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        )

    });

    test('compare with word of the day - PARTIAL', async () => {

        let x = game.setTodayWord("gamer");

        let getPlayerWord = game.compareWithTodayWord("golem");

        let output = ["PARTIAL"];

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        );

    });

    test('compare with word of the day - INCORRECT', async () => {

        let x = game.setTodayWord("slips");

        let getPlayerWord = game.compareWithTodayWord("gamer");

        let output = ["INCORRECT"];

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        );

    });

    test('check for end condition (when game has not ended)', async () => {

        let endCondition = game.getEndCondition();
        expect(endCondition).toBe(null);

    });

    test('check for end condition (when game has ended)', async () => {

        localStorage.setItem('attempts', 0);

        let endCondition = game.getEndCondition();
        expect(endCondition).toBe(game.getTodayWord());

    });

    test('set game win for today', async () => {

        localStorage.setItem('streak', '');

        game.setWonToday(5);

        expect(game.haveIWonToday()).toBe(true);
        expect(game.haveILostToday()).toBe(false);

    });

    test('set game loss for today', async () => {

        localStorage.setItem('streak', '');

        game.setLossToday();

        expect(game.haveIWonToday()).toBe(false);
        expect(game.haveILostToday()).toBe(true);

    });

    test('check if user cannot share', async () => {

        localStorage.setItem('matrix', '');

        expect(game.canIShare()).toBe(false);

    });

    test('check if user can share', async () => {

        localStorage.setItem('matrix', '[["S","A","U","L","T"],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]');

        expect(game.canIShare()).toBe(true);

    });

});

describe("Unit Testing: Time Functions", () => {

    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    test('Check for current date', async () => {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        let currentDate = yyyy + "-" + mm + "-" + dd;

        expect(currentDate).toBe(game.getToday());

    });

    test('Check for current day over', async () => {

        let dateVal = "2022-05-06";
        let storedVal = game.setStoredDate(dateVal);

        let today = game.getToday();

        let isDayOver = game.isCurrentDayOver();

        if (storedVal !== today) {
            expect(isDayOver).toBe(true);
        }

    });

    test('Get time until midnight', async () => {

        let timeUntil = game.getRemainingTime(nextMidnight);

        expect(timeUntil > 0).toBeTruthy();

    });

    test('Parse time', async () => {

        let timeUntil = game.getRemainingTime(nextMidnight);
        let parsed = game.parseTime(timeUntil);

        expect(parsed.length).toEqual(3);

    });

});

describe("Unit Testing: Guess Distributions (Visual)", () => {

    test('Get current graphical stats when no game has been played', async () => {

        localStorage.clear();

        let guessDistributions = game.getGuessDistribution();

        for (let i = 0; i < 6; i++) {
            expect(guessDistributions[i]['percentage']).toEqual(0);
        }

    });

    test('Get current graphical stats when a game has been played', async () => {

        localStorage.setItem('guesses', JSON.stringify([
            {
                value: 1,
            },
            {
                value: 1,
            },
            {
                value: 1,
            },
            {
                value: 1,
            },
            {
                value: 1,
            },
            {
                value: 1,
            }
        ]));

        let guessDistributions = game.getGuessDistribution();

        for (let i = 0; i < 6; i++) {

            // Expect each to have 16% percentage

            expect(guessDistributions[i]['percentage']).toEqual(16);

        }

    });

});

describe("Unit Testing: Colour Modes", () => {

    test('Enable Dark Mode', async () => {

        game.setColoursMode(true, false);

        expect(game.isDarkMode()).toEqual(true);

    });

    test('Enable Accessibility Mode', async () => {

        game.setColoursMode(false, true);

        expect(game.isAccessibleColourMode()).toEqual(true);

    });

});