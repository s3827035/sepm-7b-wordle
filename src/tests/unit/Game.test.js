import Game from "../../helpers/Game";
const game = new Game();
describe("Unit Testing: Game Functionality", () => {

    test('Check for current date', async () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        let currentDate = yyyy + "-" + mm + "-" + dd;

        expect(currentDate).toBe(game.getToday())
    });
    
    test('Check for current day over', async () => {
        let dateVal = "2022-05-06"
        let storedVal = game.setStoredDate(dateVal)

        let today = game.getToday();

        let isDayOver = game.isCurrentDayOver()
        
        if (storedVal != today) {
            expect(isDayOver).toBe(true)
        }
    });

    test('compare with word of the day - MATCH', async () => {

        let x = game.setTodayWord("hello")

        let getPlayerWord = game.compareWithTodayWord("hello")
        
        let output = ["MATCH"]

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        )
    });

    test('compare with word of the day - PARTIAL', async () => {

        let x = game.setTodayWord("gamer")

        let getPlayerWord = game.compareWithTodayWord("golem")
        
        let output = ["PARTIAL"]

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        )
    });

    test('compare with word of the day - INCORRECT', async () => {

        let x = game.setTodayWord("slips")

        let getPlayerWord = game.compareWithTodayWord("gamer")
        
        let output = ["INCORRECT"]

        expect(getPlayerWord).toEqual(
            expect.arrayContaining(output)
        )
    });


    // test('check for saving matrix', async () => {

    //     let x = game.saveMatrix()
    //     let y = localStorage.getItem("matrix")

    //     expect(y).toBe(null)
    // });

    test('check for end condition', async () => {

        let endCondition = game.getEndCondition();

        expect(endCondition).toBe(null)
    });




});