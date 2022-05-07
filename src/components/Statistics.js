import {Modal, Dropdown, DropdownButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";

function Statistics(props) {

    const [played, setPlayed] = useState(0);
    const [win, setWin] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);

    const addDays = (date, n) => {

        let oneDayInMs = 86400 * 1000;
        let newDate = new Date(Date.parse(date) + (n * oneDayInMs));

        return newDate.toISOString().split('T')[0];

    };

    useEffect(() => {

        let streak = props.streak;
        let currentStreak = 0;
        let maxStreak = 0;
        let wins = 0;
        let lastDate = '0000-00-00';

        setPlayed(streak.length);

        for (let [i, j] of Object.entries(streak)) {

            if (j.won === true) {
                wins++;
            }

        }

        setWin(wins / streak.length * 100);

        for (let [i, j] of Object.entries(streak)) {

            if (lastDate === '0000-00-00') {
                lastDate = addDays(j['date'], -1);
            }

            if (addDays(lastDate, 1) === j['date']) {
                currentStreak++;
            } else {
                currentStreak = 0;
            }

            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }

        }

        setCurrentStreak(currentStreak);
        setMaxStreak(maxStreak);

    }, []);

    return (

        <Modal show={props.open} onHide={props.close} animation={true}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Statistics</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div id="statistics">
                    <div className="statistic-container">
                        <div className="statistic">{played}</div>
                        <div className="label">Played</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">{win}</div>
                        <div className="label">Win %</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">{currentStreak}</div>
                        <div className="label">Current Streak</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">{maxStreak}</div>
                        <div className="label">Max Streak</div>
                    </div>
                </div>

                <br/>

                <h4 className="h4"><b>Guess Distribution</b></h4>

                To be done.

                <br/>
                <br/>
                <br/>

                <div className="row">

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <h4 className="h4"><b>Next Wordle</b></h4>

                        TIMER HERE

                    </div>

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <DropdownButton id="dropdown-basic-button" title="Share" size="lg">
                            <Dropdown.Item href="#/action-1">Facebook</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Twitter</Dropdown.Item>
                        </DropdownButton>

                    </div>

                </div>

            </Modal.Body>
        </Modal>

    );

}

export default Statistics;
