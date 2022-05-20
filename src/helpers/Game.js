import Storage from "./Storage";

export default class Game {

    constructor(search) {
        this.search = search;
        this.storage = new Storage();
        this.storage.set("attempts", 6);
        this.storage.set("end", false);
    }

    // Getter and Setters

    getRandomWord() {
        return this.search.randomWord();
    }

    setTodayWord(word) {
        this.storage.set("wordle", word);
    }

    getTodayWord() {
        return this.storage.get("wordle");
    }

    getStoredDate() {
        return this.storage.get("current");
    }

    setStoredDate(date) {
        this.storage.set("current", date);
    }

    getToday() {

        // Get today's date
        // Arrange into Y-m-d

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        return yyyy + "-" + mm + "-" + dd;

    }

    isCurrentDayOver() {

        // Get today's word and the stored date

        let today = this.getToday();
        let storedDate = this.getStoredDate();

        // Check if the stored date is empty or not equal

        return storedDate === undefined || storedDate !== today;

    }

    generateWordleForTodayIfRequired() {

        // If today's not over

        if (this.isCurrentDayOver()) {

            // Get a new word

            const word = this.getRandomWord();

            // Set the new word and new date

            this.setTodayWord(word);
            this.setStoredDate(this.getToday());

        }

    }

    compareWithTodayWord(word) {

        // Split to get the array of submitted word and today's word

        let output = [];
        let wordArray = word.toLowerCase().split('');
        let todayWord = this.getTodayWord().split('');

        // GREEN: PERFECT MATCH
        // YELLOW: EXISTS BUT IN WRONG POSITION
        // GRAY: NOT CORRECT AT ALL

        // Loop through the length of the word

        for (let i = 0; i < wordArray.length; i++) {

            // Assign the letter

            let myLetter = wordArray[i];
            let wordLetter = todayWord[i];

            // If the letters match exactly

            if (myLetter === wordLetter) {

                // Set the output to match

                output[i] = "MATCH";

            } else {

                let foundAtOtherPlace = false;

                // Loop through each word letter

                for (let j = 0; j < todayWord.length; j++) {

                    // Get the current letter from the loop

                    let thisLetter = todayWord[j];

                    // If the word is found at a different spot

                    if (thisLetter === myLetter) {
                        foundAtOtherPlace = true;
                        break;
                    }

                }

                // If the letter was found at a different place

                if (foundAtOtherPlace) {

                    // Set as partially correct

                    output[i] = "PARTIAL";

                } else {

                    // Set as incorrect

                    output[i] = "INCORRECT";

                }

            }

        }

        return output;

    }

    saveMatrix() {

        let matrix = [];

        // Loop through row

        for (let i = 0; i < 6; ++i) {

            let row = [];

            // Loop through each letter

            for (let j = 0; j < 5; ++j) {
                row.push(document.getElementById('tile-' + i + "-" + j).innerHTML);
            }

            // Push into matrix array

            matrix.push(row);

        }

        // Update the storage

        this.storage.set('matrix', JSON.stringify(matrix));

    }

    getEndCondition() {

        // If the number of attempts is 0

        if (this.storage.get("attempts") < 1) {

            this.storage.set("end", true);

            // Return the word

            return this.getTodayWord();

        }

        // Otherwise, return NULL

        return null;

    }

    // Getter and Setter

    getAttempts() {
        return this.storage.get("attempts");
    }

    setAttempts(attempts) {
        this.storage.set("attempts", attempts);
    }

    getGameMatrix() {

        // Load through localStorage

        let matrix = this.storage.get('matrix');

        // If the storage is empty or NULL

        if (matrix === null || matrix === "") {

            matrix = [];

        } else {

            // Parse the JSON string

            matrix = JSON.parse(matrix);

        }

        return matrix;

    }

    getStreak() {

        // Load through localStorage

        let streak = this.storage.get('streak');

        if (streak === null || streak === "") {

            streak = [];

        } else {

            // Parse the JSON string

            streak = JSON.parse(streak);

        }

        return streak;

    }

    setWonToday(attempt) {

        // Load through localStorage

        let streak = this.storage.get('streak');
        let guessDistributions = this.storage.get('guesses');
        let guessDistributionsArr = [];

        if (streak === null || streak === "") {

            streak = [];

        } else {

            // Parse the JSON string

            streak = JSON.parse(streak);

        }

        // If the local storage is empty

        if (guessDistributions === null || typeof guessDistributions === 'undefined' || guessDistributions === '') {

            // Set an empty array

            guessDistributionsArr = [
                {
                    value: 0
                },
                {
                    value: 0
                },
                {
                    value: 0
                },
                {
                    value: 0
                },
                {
                    value: 0
                },
                {
                    value: 0
                }
            ];

        } else {

            guessDistributionsArr = JSON.parse(guessDistributions);

        }

        // Push the game outcome into the array

        streak.push({
            date: this.getToday(),
            won: true
        });

        // Update the guess distribution

        guessDistributionsArr[attempt] = {
            value: guessDistributionsArr[attempt]['value'] + 1
        };

        // Update storage

        this.storage.set('streak', JSON.stringify(streak));
        this.storage.set('guesses', JSON.stringify(guessDistributionsArr));

    }

    setLossToday() {

        // Load through localStorage

        let streak = this.storage.get('streak');

        if (streak === null || streak === "") {

            streak = [];

        } else {

            // Parse the JSON string

            streak = JSON.parse(streak);

        }

        // Push the game outcome into the array

        streak.push({
            date: this.getToday(),
            won: false
        });

        // Update storage

        this.storage.set('streak', JSON.stringify(streak));

    }

    haveIWonToday() {

        // Load through localStorage

        let streak = this.storage.get('streak');

        if (streak === null || streak === "") {

            streak = [];

        } else {

            // Parse the JSON string

            streak = JSON.parse(streak);

        }

        // Get today's date

        let today = this.getToday();

        // Loop through history record

        for (let [i, j] of Object.entries(streak)) {

            // If the date is equal to today and the game was WON

            if (today === j.date && j.won === true) {
                return true;
            }

        }

        return false;

    }

    haveILostToday() {

        // Load through localStorage

        let streak = this.storage.get('streak');

        if (streak === null || streak === "") {

            streak = [];

        } else {

            // Parse the JSON string

            streak = JSON.parse(streak);

        }

        // Get today's date

        let today = this.getToday();

        // Loop through history record

        for (let [i, j] of Object.entries(streak)) {

            // If the date is equal to today and the game was LOST

            if (today === j.date && j.won === false) {
                return true;
            }

        }

        return false;

    }

    canIShare() {

        // Load through localStorage

        let matrix = this.storage.get('matrix');

        // If the variable isn't null, empty or an empty array

        return !(matrix === null || matrix === "" || matrix === '[]');

    }

    getGuessDistribution() {

        // Load through localStorage

        let guessDistributions = this.storage.get('guesses');

        // If the variable isn't null, empty or an empty array

        if (guessDistributions === "" || guessDistributions === null || typeof guessDistributions === 'undefined') {

            return [
                {
                    percentage: 0,
                    value: 0,
                    top: false
                },
                {
                    percentage: 0,
                    value: 0,
                    top: false
                },
                {
                    percentage: 0,
                    value: 0,
                    top: false
                },
                {
                    percentage: 0,
                    value: 0,
                    top: false
                },
                {
                    percentage: 0,
                    value: 0,
                    top: false
                },
                {
                    percentage: 0,
                    value: 0,
                    top: false
                }
            ];

        } else {

            // Parse as JSON

            let guessDistributionsAr = JSON.parse(guessDistributions);
            let arr = [];

            let totalValue = 0;
            let topId = -1;
            let topValue = 1;

            // Loop through item

            for (let i = 0; i < guessDistributionsAr.length; i++) {

                // Calculate total games played

                totalValue += guessDistributionsAr[i]['value'];

                // Check if this row has more correct guesses

                if (guessDistributionsAr[i]['value'] >= topValue) {
                    topId = i;
                    topValue = guessDistributionsAr[i]['value'];
                }

            }

            // Loop through each row

            for (let i = 0; i < guessDistributionsAr.length; i++) {

                // Populate the array with percentage and value

                arr.push({
                    value: guessDistributionsAr[i]['value'],
                    percentage: parseInt(guessDistributionsAr[i]['value'] / totalValue * 100),
                    top: (topId === i)
                });

            }

            return arr;

        }

    }

    getRemainingTime = (nextMidnight) => {

        // Get current date

        let now = new Date();

        // Get the current time in seconds

        let time = (nextMidnight.getTime() - now.getTime()) / 1000;

        // If the time is negative, that means, it's past midnight

        if (time < 0) {

            // Get current date

            nextMidnight = new Date();

            // Get the next midnight

            nextMidnight.setHours(24, 0, 0, 0);

            // Recalculate

            return this.getRemainingTime(nextMidnight);

        }

        return time;

    };

    parseTime = (time) => {

        // Calculate hours

        const hours = Math.floor(time / 3600);
        let rest = time - (hours * 3600);

        // Calculate minutes

        const minutes = Math.floor(rest / 60);
        rest = rest - (minutes * 60);

        // Calculate seconds

        const seconds = Math.floor(rest);

        return [hours, minutes, seconds];

    };

    isDarkMode = () => {

        // Load dark theme status from storage

        let darkTheme = this.storage.get("dark_theme");

        return darkTheme == 'true';

    };

    isAccessibleColourMode = () => {

        // Load high contrast theme status from storage

        let accessibleColourMode = this.storage.get("accessible_colour_mode");

        return accessibleColourMode == 'true';

    };

    setColoursMode = (dark, accessible) => {

        // Update storage

        this.storage.set("dark_theme", dark);
        this.storage.set("accessible_colour_mode", accessible);

    };

    getMatchType = (letter) => {

        let matrix = this.getGameMatrix();
        let matchType = 'NOT_COVERED';

        for (let i = 0; i < matrix.length; ++i) {

            let row = matrix[i];
            let formedWord = row[0] + row[1] + row[2] + row[3] + row[4];
            let compare = this.compareWithTodayWord(formedWord);

            for (let j = 0; j < compare.length; ++j) {

                if (row[j] === letter) {

                    matchType = compare[j];

                    if (matchType === 'MATCH') {
                        return matchType;
                    }

                }

            }

        }

        return matchType;

    };

}