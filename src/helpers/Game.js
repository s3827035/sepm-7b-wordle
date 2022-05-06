import Storage from "./Storage";

export default class Game {

    constructor(search) {
        this.search = search;
        this.storage = new Storage();
        this.storage.set("attempts", 6);
        this.storage.set("end", false);
    }

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

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        return yyyy + "-" + mm + "-" + dd;

    }

    isCurrentDayOver() {

        let today = this.getToday();
        let storedDate = this.getStoredDate();

        return storedDate === undefined || storedDate !== today;

    }

    generateWordleForTodayIfRequired() {

        if (this.isCurrentDayOver()) {

            const word = this.getRandomWord();

            this.setTodayWord(word);
            this.setStoredDate(this.getToday());

        }

    }

    compareWithTodayWord(word) {

        let output = [];
        let wordArray = word.toLowerCase().split('');
        let todayWord = this.getTodayWord().split('');

        // GREEN: PERFECT MATCH
        // YELLOW: EXISTS BUT IN WRONG POSITION
        // GRAY: NOT CORRECT AT ALL

        for (let i = 0; i < wordArray.length; i++) {

            let myLetter = wordArray[i];
            let wordLetter = todayWord[i];

            if (myLetter === wordLetter) {

                output[i] = "MATCH";

            } else {

                let foundAtOtherPlace = false;

                for (let j = 0; j < todayWord.length; j++) {

                    let thisLetter = todayWord[j];

                    if (thisLetter === myLetter) {
                        foundAtOtherPlace = true;
                        break;
                    }

                }

                if (foundAtOtherPlace) {
                    output[i] = "PARTIAL";
                } else {
                    output[i] = "INCORRECT";
                }

            }

        }

        return output;

    }

    saveMatrix() {

        let matrix = [];

        for (let i = 0; i < 6; ++i) {

            let row = [];

            for (let j = 0; j < 5; ++j) {
                row.push(document.getElementById('tile-' + i + "-" + j).innerHTML);
            }

            matrix.push(row);

        }

        this.storage.set('matrix', JSON.stringify(matrix));

    }

    getEndCondition() {

        if (this.storage.get("attempts") < 1) {
            this.storage.set("end", true);
            return this.getTodayWord();
        }

        return null;

    }

    getAttempts() {
        return this.storage.get("attempts");
    }

    setAttempts(attempts) {
        this.storage.set("attempts", attempts);
    }

}