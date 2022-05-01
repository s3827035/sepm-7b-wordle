export default class Game {

    constructor(search) {
        this.search = search;
    }

    getRandomWord() {
        return this.search.randomWord();
    }

    setTodayWord() {
        Storage.set("wordle", this.getRandomWord());
    }

    getTodayWord() {
        Storage.get("wordle");
    }

    getStoredDate() {
        Storage.get("current");
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

        if (storedDate === null || storedDate !== today) {

            Storage.set("wordle", this.getRandomWord());
            Storage.set("current", today);

        }

    }

}