import "./static/app.css";
import Row from "./components/Row";
import Keyboard from "./components/Keyboard";

import React, {useEffect, createContext, useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import toast, {Toaster} from 'react-hot-toast';
import Search from "./helpers/Search";
import Game from "./helpers/Game";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";

export const AppContext = createContext();

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
    const [currAttempt, setCurrAttempt] = useState({attempt: 0, letterPos: 0});

    // Statistics modal

    const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

    // Settings modal

    const [darkMode, setDarkMode] = useState(null);
    const [highContrastMode, setHighContrastMode] = useState(null);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

                        // Set the attempts

                        game.setAttempts(6 - currentRow - 1);

                        // Did they guess it correctly?

                        if (rowMatrix[0] === 'MATCH' && rowMatrix[1] === 'MATCH' && rowMatrix[2] === 'MATCH' && rowMatrix[3] === 'MATCH' && rowMatrix[4] === 'MATCH') {

                            // Set the game state to won

                            game.setWonToday(currentRow);

                            // Reduce attempts to 0

                            game.setAttempts(0);

                            // Lock the game by setting the last of row and column

                            setCurrentRow(6);
                            setCurrentColumn(5);

                            // Open the statistics automatically

                            setIsStatisticsModalOpen(true);

                        }

                        // Did they lose today's game?

                        if (currentRow === 5) {

                            // Set the game as lost

                            game.setLossToday();

                            // Open the game

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

                // Loop through stored game board

                for (let [i, j] of Object.entries(matrixArr)) {

                    thisCol = 0;

                    // Loop through each column

                    for (let [y, k] of Object.entries(matrixArr[i])) {

                        // Set the new row

                        newRows[thisRow][thisCol] = k.toUpperCase();
                        thisCol++;

                    }

                    thisRow++;

                    // if the row is filled completely, record the last filled row

                    if (newRows[lastFilledRow][4] !== "") {
                        lastFilledRow++;
                    }

                }

                // Set game state

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

        // Get the current matrix

        let currentMatrix = matrix.slice();

        // Loop through the rows

        for (let i = 0; i < 6; ++i) {

            // if the row isn't filled

            if (board[i][0] === '') {

                // put empty columns

                currentMatrix[i] = ['', '', '', '', ''];

            } else {

                // Set the formed word

                let formedWord = board[i][0] + board[i][1] + board[i][2] + board[i][3] + board[i][4];

                // Set the outcome matrix

                currentMatrix[i] = game.compareWithTodayWord(formedWord);

            }

        }

        // Set the game matrix

        setMatrix(currentMatrix);

        // If the game has ended

        if (game.haveIWonToday() || game.haveILostToday()) {

            // Set the attempts to 0

            game.setAttempts(0);

            // Set the row to the last column and row to lock the game

            setCurrentRow(6);
            setCurrentColumn(5);

            // Open the stats modal

            setIsStatisticsModalOpen(true);

        } else {

            // Reduce the game attempts

            game.setAttempts(6 - currentRow - 1);

        }

    }, [isMatrixDrawn]);

    useEffect(() => {

        if (darkMode !== null && highContrastMode !== null) {
            game.setColoursMode(darkMode, highContrastMode);
        }

    }, [darkMode, highContrastMode]);

    useEffect(() => {

        setDarkMode(game.isDarkMode());
        setHighContrastMode(game.isAccessibleColourMode());

    }, []);

    return (
        <div className={"game " + (darkMode ? 'dark' : '') + " " + (highContrastMode ? 'high-contrast' : '')}>

            <div className="error"><Toaster/></div>

            <Statistics game={game} darkMode={darkMode} highContrastMode={highContrastMode} open={isStatisticsModalOpen} close={() => setIsStatisticsModalOpen(false)}/>
            <Settings darkMode={darkMode} highContrastMode={highContrastMode} setDarkMode={setDarkMode} setHighContrastMode={setHighContrastMode} open={isSettingsModalOpen} close={() => setIsSettingsModalOpen(false)}/>

            <Navbar className={darkMode ? 'navbar-dark' : ''}>
                <Container>
                    <Navbar.Toggle/>

                    <Navbar.Brand><b>Wordle</b></Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">

                        <Nav>
                            <Nav.Link id="statistics-link" onClick={() => setIsStatisticsModalOpen(true)}>Statistics</Nav.Link>
                            <Nav.Link id="settings-link" onClick={() => setIsSettingsModalOpen(true)}>Settings</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="end-condition" align="center">
                <div id="word-of-the-day" className={finalWord === null ? 'hidden-word' : ''}>{game.getEndCondition()}</div>
            </div>

            <AppContext.Provider value={{board, game, setBoard, currAttempt, setCurrAttempt, keyPressHandler}}>

                <div className="game-rows">

                    {/* Loop from 0 to 6 and draw the rows */}

                    {new Array(numberOfRows).fill(0).map((_, index) => (
                        <Row key={index} rowId={index} values={board[index]} matrix={matrix[index]}/>
                    ))}

                </div>

                <div className="game-keyboard">
                    <Keyboard/>
                </div>

            </AppContext.Provider>

        </div>
    );

}

export default App;
