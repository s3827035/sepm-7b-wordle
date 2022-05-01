export default class Search {

    randomWord() {

        let length =  this.list.length;
        let rand = Math.round(Math.random() * (length - 1));

        return this.list.slice(rand, rand + 1)[0];

    }

    async loadWordList() {

        let data = await fetch("https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt");
        this.list = (await data.text()).split("\n");

        return this.list;

    }

    isWordValid(formedWord) {
        return this.list.includes(formedWord.toLowerCase());
    }

}