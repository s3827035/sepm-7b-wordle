import React, {useContext} from "react";
import {AppContext} from "../App";

function Key({keyVal, isBigKey}) {

    const {board, setBoard, currAttempt, setCurrAttempt, keyPressHandler} = useContext(AppContext);

    const keyPress = () => {

        if (keyVal === "ENTER") {

            keyPressHandler({
                code: "Enter",
                key: keyVal
            });

        } else if (keyVal === "DELETE") {

            keyPressHandler({
                code: "Backspace",
                key: keyVal
            });

        } else {

            keyPressHandler({
                code: "Key" + keyVal,
                key: keyVal
            });

        }


    };

    return <div key={keyVal} className="key" id={isBigKey && "big"} onClick={keyPress}>{keyVal}</div>;

}

export default Key;