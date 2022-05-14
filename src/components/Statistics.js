import {Modal, Dropdown, DropdownButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';

function Statistics(props) {

    // Page Variables

    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    const [played, setPlayed] = useState(0);
    const [win, setWin] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);

    const [hoursRemaining, setHoursRemaining] = useState("00");
    const [minutesRemaining, setMinutesRemaining] = useState("00");
    const [secondsRemaining, setSecondsRemaining] = useState("00");

    const [guessDistributions, setGuessDistributions] = useState([
        {
            percentage: 0,
            value: 0
        },
        {
            percentage: 0,
            value: 0
        },
        {
            percentage: 0,
            value: 0
        },
        {
            percentage: 0,
            value: 0
        },
        {
            percentage: 0,
            value: 0
        },
        {
            percentage: 0,
            value: 0
        }
    ]);

    const addDays = (date, n) => {

        // Day in milliseconds

        let oneDayInMs = 86400 * 1000;

        // Get date with added time

        let newDate = new Date(Date.parse(date) + (n * oneDayInMs));

        // Return in Y-m-d format

        return newDate.toISOString().split('T')[0];

    };

    const share = (network) => {

        // Check if the user can share

        if (props.game.canIShare()) {

            // Load the game board matrix from storage

            let matrix = props.game.getGameMatrix();
            let outcomeStr = '';

            // Loop for each row

            for (let i = 0; i < 6; ++i) {

                // Make the word

                let formedWord = matrix[i][0] + matrix[i][1] + matrix[i][2] + matrix[i][3] + matrix[i][4];

                // Get the outcomes

                let outcomeMatrix = props.game.compareWithTodayWord(formedWord);

                // Loop through each column

                for (let j = 0; j < 5; ++j) {

                    // Add appropriate boxes

                    if (outcomeMatrix[j] === 'MATCH') {
                        outcomeStr += '🟩';
                    } else if (outcomeMatrix[j] === 'PARTIAL') {
                        outcomeStr += '🟨';
                    } else if (outcomeMatrix[j] === 'INCORRECT') {
                        outcomeStr += '⬜';
                    }

                }

                // Add a line break

                outcomeStr += "\n";

            }

            // Copy the results

            navigator.clipboard.writeText(outcomeStr)
                .then(r => {

                    // Show a message

                    toast.success("Copied results to clipboard");

                    // Open a new tab based on the social network

                    if (network === 'FB') {
                        window.open("https://www.facebook.com/", '_blank');
                    }

                    if (network === 'TW') {
                        window.open("https://twitter.com/home", '_blank');
                    }

                });

        } else {

            // Show an error if the user has not shared

            toast.error("Must have played a game today to share");

        }

    };

    useEffect(() => {

        // Get history

        let streak = props.game.getStreak();
        let currentStreak = 0;
        let maxStreak = 0;
        let wins = 0;
        let lastDate = '0000-00-00';

        // Get the number of games played

        setPlayed(streak.length);

        // Loop through history

        for (let [i, j] of Object.entries(streak)) {

            // Sum the wins

            if (j.won === true) {
                wins++;
            }

        }

        // Calculate win percentage

        let winRate = wins / streak.length * 100;

        if (isNaN(winRate)) {
            winRate = 0;
        }

        setWin(winRate);

        // Loop through history

        for (let [i, j] of Object.entries(streak)) {

            // Set the first date of the streak

            if (lastDate === '0000-00-00') {
                lastDate = addDays(j['date'], -1);
            }

            // If the user has won on the next day as well, sum up the streak

            if (addDays(lastDate, 1) === j['date'] && j['won'] === true) {
                currentStreak++;
            } else {
                currentStreak = 0;
            }

            // Check if the current streak is bigger than max streak

            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }

        }

        setCurrentStreak(currentStreak);
        setMaxStreak(maxStreak);

        // Calculate time remaining

        setInterval(() => {

            // Get time remaining

            let timeRemaining = props.game.parseTime(props.game.getRemainingTime(nextMidnight));

            // Set the state variables every one second

            setHoursRemaining(timeRemaining[0]);
            setMinutesRemaining(timeRemaining[1]);
            setSecondsRemaining(timeRemaining[2]);

        }, 1000);

    }, [props.open]);

    useEffect(() => {
        setGuessDistributions(props.game.getGuessDistribution());
    }, []);

    return (

        <Modal show={props.open} onHide={props.close} animation={true}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Statistics</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div id="statistics">

                    <div className="statistic-container">
                        <div className="statistic" id="played">{played}</div>
                        <div className="label">Played</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic" id="win">{win}</div>
                        <div className="label">Win %</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic" id="current-streak">{currentStreak}</div>
                        <div className="label">Current Streak</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic" id="max-streak">{maxStreak}</div>
                        <div className="label">Max Streak</div>
                    </div>

                </div>

                <br/>

                <h4 className="h4"><b>Guess Distribution</b></h4>

                {guessDistributions.map((item, index) => (

                    <div className="guess-distribution" key={index}>
                        <span>{index + 1}</span>
                        <div style={{width: item['percentage'] + "%"}} className={item['top'] === true ? "top-bar" : ''}>{item['value']}</div>
                    </div>

                ))}

                <br/>
                <br/>
                <br/>

                <div className="row">

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <h4 className="h4"><b>Next Wordle</b></h4>

                        <span className="time-remaining" id="time-remaining">
                            {hoursRemaining}:{minutesRemaining}:{secondsRemaining}
                        </span>

                    </div>

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <DropdownButton id="dropdown-basic-button" title="Share" size="lg">
                            <Dropdown.Item onClick={() => share('FB')} id="fb-share">Facebook</Dropdown.Item>
                            <Dropdown.Item onClick={() => share('TW')} id="tw-share">Twitter</Dropdown.Item>
                        </DropdownButton>

                    </div>

                </div>

            </Modal.Body>
        </Modal>

    );

}

export default Statistics;
