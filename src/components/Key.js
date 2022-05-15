import React, {useContext} from "react";
import { AppContext } from "../App";

function Key({keyVal, isBigKey}) {

    const {board, setBoard, currAttempt, setCurrAttempt} = useContext(AppContext);

    // function for pressing down selected letter when letter is clicked
    const keyPress = () => {
        //if the value pressed is ENTER, if the number of attempts is less than 5, return, otherwise, move down vertically and reset the letter position
        if (keyVal === "ENTER")
        {
            if(currAttempt.letterPos !== 5) return;
            setCurrAttempt({attempt: currAttempt.attempt + 1, letterPos: 0});
        } 
        // if the value pressed is DELETE, if the letter position is 0 (nothing to delete), return, otherwise create a new instance of the board, set the prior letter pos to an empty string, and bring the letter position back 1 for the next entry
        else if (keyVal === "DELETE") {
            if(currAttempt.letterPos === 0) return;
            const newBoard = [...board]
            newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
            setBoard(newBoard);
            setCurrAttempt({...currAttempt, letterPos: currAttempt.letterPos -1 });

        } else 
        {

        // if the current attempt in 4, do not run
        if(currAttempt.letterPos > 4) return;
        //creates a new instance of the board, and assigns the position to our keyvalue, and sets the original instance of the game to our current one
        const newBoard = [...board]
        newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
        setBoard(newBoard);
        setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1});
        }
    }

    return <div className = "key" id={isBigKey && "big"} onClick={keyPress}>{keyVal}</div>;


}

export default Key;