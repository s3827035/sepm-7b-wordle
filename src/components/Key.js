import React, {useContext} from "react";
import { AppContext } from "../App";

function Key({keyVal, isBigKey}) {

    const {board, setBoard, currentColumn, setCurrentColumn} = useContext(AppContext);

    // function for pressing down selected letter when letter is clicked
    const keyPress = () => {
        
        const newBoard = [...board]
        newBoard[0][0] = keyVal;
        setBoard(newBoard);
        setCurrentColumn({ ...currentColumn, letterPos: currentColumn.letterPos + 1});

    }

    return <div className = "key" id={isBigKey && "big"} onClick={keyPress}>{keyVal}</div>;


}

export default Key;