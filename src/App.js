import "./static/app.css";
import Row from "./components/Row";

import React, {useState} from "react";
import {Nav, Navbar, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [currentRow, setCurrentRow] = useState(0);
    const [currentColumn, setCurrentColumn] = useState(0);

    const [rows, setRows] = useState({
        0: ["", "", "", "", ""],
        1: ["", "", "", "", ""],
        2: ["", "", "", "", ""],
        3: ["", "", "", "", ""],
        4: ["", "", "", "", ""],
        5: ["", "", "", "", ""]
    });

    const numberOfRows = 6;

    return (
        <div className="App">

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
