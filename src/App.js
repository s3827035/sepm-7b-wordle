import "./static/app.css";
import Row from "./components/Row";

import React, {useState, useEffect} from "react";
import {Nav, Navbar, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import toast, {Toaster} from 'react-hot-toast';
import Search from "./helpers/Search";

const search = new Search();

search.loadWordList();

function App() {

    const [currentRow, setCurrentRow] = useState(0);
    const [currentColumn, setCurrentColumn] = useState(0);

    const [rows, setRows] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]);

    const numberOfRows = 6;

    const keyPressHandler = (e) => {

        let keyPressed = e.key;
        let keyCode = e.code;

        if (!e.repeat) {

            if (keyCode.includes("Key") && currentColumn < 5) {

                let newRows = rows.slice();

                newRows[currentRow][currentColumn] = keyPressed.toUpperCase();

                setRows(newRows);
                setCurrentColumn(currentColumn + 1);

            } else if (keyCode.includes("Enter")) {

                if (currentColumn === 5) {

                    let formedWord = rows[currentRow][0] + rows[currentRow][1] + rows[currentRow][2] + rows[currentRow][3] + rows[currentRow][4];

                    let result = search.isWordValid(formedWord);

                    if (result) {

                        setCurrentRow(currentRow + 1);
                        setCurrentColumn(0);

                    } else {

                        toast.error("Not in the word list");

                    }

                } else {

                    toast.error("Not enough letters!");

                }

            } else if (keyCode.includes("Backspace")) {

                if (currentColumn > 0) {

                    let newRows = rows.slice();

                    newRows[currentRow][currentColumn - 1] = "";

                    setRows(newRows);
                    setCurrentColumn(currentColumn - 1);

                }

            }

        }

    };

    useEffect(() => {
        window.addEventListener('keydown', keyPressHandler);
        return () => window.removeEventListener("keydown", keyPressHandler);
    }, [rows, currentRow, currentColumn]);

    useEffect(() => {



    }, []);

    return (
        <div className="App">

            <div><Toaster/></div>

            <Navbar>
                <Container>
                    <Navbar.Toggle/>

                    <Navbar.Brand><b>Wordle</b></Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">

                        <Nav>
                            <Nav.Link onClick={() => console.log('To Be Implemented')}>Statistics</Nav.Link>
                            <Nav.Link onClick={() => console.log('To Be Implemented')}>Settings</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="game-rows">

                {new Array(numberOfRows).fill(0).map((_, index) => (
                    <Row key={index} values={rows[index]}/>
                ))}

            </div>

        </div>
    );

}

export default App;
