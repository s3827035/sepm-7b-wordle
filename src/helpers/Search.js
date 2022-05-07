export default class Search {

    randomWord() {

        // Get the total length of the list

        let length = this.list.length;

        // Get a random number from 0 to N - 1

        let rand = Math.round(Math.random() * (length - 1));

        // Get the random word

        return this.list.slice(rand, rand + 1)[0];

    }

    async loadWordList() {

        // Load the list of words from GitHub

        let data = await fetch("https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt");

        // Convert to array

        this.list = (await data.text()).split("\n");

        return this.list;

    }

    isWordValid(formedWord) {

        // Check if the word is part of the list

        return this.list.includes(formedWord.toLowerCase());

    }

}