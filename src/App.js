import "./static/app.css";
import Row from "./components/Row";

import React, {useEffect, useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import toast, {Toaster} from 'react-hot-toast';
import Search from "./helpers/Search";
import Game from "./helpers/Game";
import Statistics from "./components/Statistics";

// Create the Search object

const search = new Search();
const game = new Game(search);

// Load the word list in the memory

search.loadWordList().then(r => {

    // Generate a Wordle if required

    game.generateWordleForTodayIfRequired();

});

function App() {

    // Variables that point to the user row and column position

    const [currentRow, setCurrentRow] = useState(0);
    const [currentColumn, setCurrentColumn] = useState(0);

    // Statistics modal

    const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

    // Final Word

    const finalWord = game.getEndCondition();

    // Game board

    const [board, setBoard] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]);

    // Game matrix

    const [matrix, setMatrix] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]);

    // Matrix drawn

    const [isMatrixDrawn, setIsMatrixDrawn] = useState(false);

    // Number of rows (~6)

    const numberOfRows = 6;

    // Event handler for when the user presses a button

    const keyPressHandler = (e) => {

        // Key pressed and its code

        let keyPressed = e.key;
        let keyCode = e.code;

        // Do nothing if the game has ended

        if (currentRow < 6) {

            // If a alphabet key was pressed and we have not filled all the columns yet

            if (keyCode.includes("Key") && currentColumn < 5) {

                // Clone the array

                let newRows = board.slice();

                // Fill the alphabet in its position

                newRows[currentRow][currentColumn] = keyPressed.toUpperCase();

                // Set the variables

                setBoard(newRows);
                setCurrentColumn(currentColumn + 1);

            } else if (keyCode.includes("Enter")) {

                // If the user is on the last column

                if (currentColumn === 5) {

                    // Form the whole word from the column values

                    let formedWord = board[currentRow][0] + board[currentRow][1] + board[currentRow][2] + board[currentRow][3] + board[currentRow][4];

                    // Check if the word is part of the list

                    let result = search.isWordValid(formedWord);

                    // If the word is valid

                    if (result) {

                        // TODO:
                        // If it is the correct guess, end the game

                        let rowMatrix = game.compareWithTodayWord(formedWord);

                        // Set the matrix

                        let currentMatrix = matrix.slice();
                        currentMatrix[currentRow] = rowMatrix;

                        setMatrix(currentMatrix);

                        // Switch the user into the next row and first column

                        setCurrentRow(currentRow + 1);
                        setCurrentColumn(0);

                        // Save the matrix

                        game.saveMatrix();

                        // Check end condition

                        game.setAttempts(6 - currentRow - 1);

                        // Did they guess it correctly?

                        if (rowMatrix[0] === 'MATCH' && rowMatrix[1] === 'MATCH' && rowMatrix[2] === 'MATCH' && rowMatrix[3] === 'MATCH' && rowMatrix[4] === 'MATCH') {
                            game.setWonToday();
                            game.setAttempts(0);
                            setCurrentRow(6);
                            setCurrentColumn(5);
                            setIsStatisticsModalOpen(true);
                        }

                        // Did they lose today's game?

                        if (currentRow === 5) {
                            game.setLossToday();
                            setIsStatisticsModalOpen(true);
                        }

                    } else {

                        // Show an error if the user is not part of the list

                        toast.error("Not in word list");

                    }

                } else {

                    // Otherwise, show an error

                    toast.error("Not enough letters!");

                }

            } else if (keyCode.includes("Backspace")) {

                // If the user presses backspace and they are not on the first column

                if (currentColumn > 0) {

                    // Clone the array

                    let newRows = board.slice();

                    // Set the string value to empty

                    newRows[currentRow][currentColumn - 1] = "";

                    // Update the variables

                    setBoard(newRows);
                    setCurrentColumn(currentColumn - 1);

                }
            }

        }

    };

    useEffect(() => {

        // Setup the event handler on every render based on the changes in the specified variables

        window.addEventListener('keydown', keyPressHandler);

        // On destruction, also remove the event listener

        return () => window.removeEventListener("keydown", keyPressHandler);

    }, [board, currentRow, currentColumn]);

    useEffect(() => {

        if (isMatrixDrawn === true) {
            return true;
        }

        // Check the state of the game

        if (!game.isCurrentDayOver()) {

            let storedMatrix = game.storage.get("matrix");

            if (storedMatrix !== null && storedMatrix !== "") {

                let matrixArr = JSON.parse(storedMatrix);

                // Clone the array

                let newRows = board.slice();
                let thisRow = 0;
                let lastFilledRow = 0;
                let thisCol = 0;

                for (let [i, j] of Object.entries(matrixArr)) {

                    thisCol = 0;

                    for (let [y, k] of Object.entries(matrixArr[i])) {

                        newRows[thisRow][thisCol] = k.toUpperCase();
                        thisCol++;

                    }

                    thisRow++;

                    if (newRows[lastFilledRow][4] !== "") {
                        lastFilledRow++;
                    }

                }

                setBoard(newRows);
                setCurrentRow(lastFilledRow);
                setCurrentColumn(0);
                setIsMatrixDrawn(true);

            }

        } else {

            game.storage.set("matrix", JSON.stringify([]));

        }

    }, []);

    useEffect(() => {

        let currentMatrix = matrix.slice();

        for (let i = 0; i < 6; ++i) {

            if (board[i][0] === '') {

                currentMatrix[i] = ['', '', '', '', ''];

            } else {

                let formedWord = board[i][0] + board[i][1] + board[i][2] + board[i][3] + board[i][4];

                currentMatrix[i] = game.compareWithTodayWord(formedWord);

            }

        }

        setMatrix(currentMatrix);

        if (game.haveIWonToday() || game.haveILostToday()) {
            game.setAttempts(0);
            setCurrentRow(6);
            setCurrentColumn(5);
            setIsStatisticsModalOpen(true);
        } else {
            game.setAttempts(6 - currentRow - 1);
        }

    }, [isMatrixDrawn]);

    return (
        <div className="App">

            <div className="error"><Toaster/></div>
            <Statistics streak={game.getStreak()} open={isStatisticsModalOpen} close={() => setIsStatisticsModalOpen(false)}/>

            <Navbar>
                <Container>
                    <Navbar.Toggle/>

                    <Navbar.Brand><b>Wordle</b></Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">

                        <Nav>
                            <Nav.Link onClick={() => setIsStatisticsModalOpen(true)}>Statistics</Nav.Link>
                            <Nav.Link onClick={() => console.log('To Be Implemented')}>Settings</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="end-condition" align="center">
                <div id="word-of-the-day" className={finalWord === null ? 'hidden-word' : ''}>{game.getEndCondition()}</div>
            </div>

            <div className="game-rows">

                {/* Loop from 0 to 6 and draw the rows */}

                {new Array(numberOfRows).fill(0).map((_, index) => (
                    <Row key={index} rowId={index} values={board[index]} matrix={matrix[index]}/>
                ))}

            </div>

        </div>
    );

}

export default App;
