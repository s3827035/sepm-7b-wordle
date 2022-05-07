import {Modal, Dropdown, DropdownButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';

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

    const share = (network) => {

        if (props.game.canIShare()) {

            let matrix = props.game.getGameMatrix();
            let outcomeStr = '';

            for (let i = 0; i < 6; ++i) {

                let formedWord = matrix[i][0] + matrix[i][1] + matrix[i][2] + matrix[i][3] + matrix[i][4];
                let outcomeMatrix = props.game.compareWithTodayWord(formedWord);

                for (let j = 0; j < 5; ++j) {

                    if (outcomeMatrix[j] === 'MATCH') {
                        outcomeStr += '🟩';
                    } else if (outcomeMatrix[j] === 'PARTIAL') {
                        outcomeStr += '🟨';
                    } else if (outcomeMatrix[j] === 'INCORRECT') {
                        outcomeStr += '⬜';
                    }

                }

                outcomeStr += "\n";

            }

            navigator.clipboard.writeText(outcomeStr)
                .then(r => {

                    toast.success("Copied results to clipboard");

                    if (network === 'FB') {
                        window.open("https://www.facebook.com/", '_blank');
                    }

                    if (network === 'TW') {
                        window.open("https://twitter.com/home", '_blank');
                    }

                });

        } else {

            toast.error("Must have played a game to share");

        }

    };

    useEffect(() => {

        let streak = props.game.getStreak();
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

        let winRate = wins / streak.length * 100;

        if (isNaN(winRate)) {
            winRate = 0;
        }

        setWin(winRate);

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

    }, [props.open]);

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
                            <Dropdown.Item onClick={() => share('FB')}>Facebook</Dropdown.Item>
                            <Dropdown.Item onClick={() => share('TW')}>Twitter</Dropdown.Item>
                        </DropdownButton>

                    </div>

                </div>

            </Modal.Body>
        </Modal>

    );

}

export default Statistics;
