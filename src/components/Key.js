import React, {useContext} from "react";
import {AppContext} from "../App";

function Key({keyVal, isBigKey}) {

    const {game, keyPressHandler} = useContext(AppContext);

    const keyPress = () => {

        // Send the appropriate event based on the key pressed

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

    let type = game.getMatchType(keyVal);

    return <div key={keyVal} className={"key " + ('k-vl-' + type.toLowerCase()) + (isBigKey ? " big" : '')} id={"Key" + keyVal} onClick={keyPress}>{keyVal}</div>;

}

export default Key;