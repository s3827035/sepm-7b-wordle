import Storage from "./Storage";

export default class Game {

    constructor(search) {
        this.search = search;
        this.storage = new Storage();
    }

    getRandomWord() {
        return this.search.randomWord();
    }

    setTodayWord(word) {
        this.storage.set("wordle", word);
    }

    getTodayWord() {
        this.storage.get("wordle");
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

    generateWordleForTodayIfRequired() {

        let today = this.getToday();
        let storedDate = this.getStoredDate();

        if (storedDate === undefined || storedDate !== today) {

            const word = this.getRandomWord();

            this.setTodayWord(word);
            this.setStoredDate(today);

        }

    }

}