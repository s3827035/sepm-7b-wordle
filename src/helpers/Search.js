import WordList from '../static/words.txt';

export default class Search {

    loadWordList() {

        fetch(WordList)
            .then(r => r.text())
            .then(text => {
                this.list = text.split("\r\n");
            });

    }

    isWordValid(formedWord) {
        return this.list.includes(formedWord.toLowerCase());
    }

}