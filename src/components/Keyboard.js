import React from 'react';
import Key from './Key'

function Keyboard() {

    // create arrays for every row on the keyboard UI //

    const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const row3 = ["Z", "X", "C", "V", "B", "N", "M"];
  
    return (
    <div className ="keyboard">
        <div className = "row1">
        {row1.map((key) => {
            return <Key keyVal={key}/>;})} 
         </div>
        <div className = "row2">
        {row2.map((key) => {
            return <Key keyVal={key}/>;})} 
         
        </div>
        <div className = "row3">
            <Key keyVal={"ENTER"} isBigKey/>
        {row3.map((key) => {
            return <Key keyVal={key}/>;})} 
            <Key keyVal={"DELETE"} isBigKey />
        </div>
    </div>
    );
}

export default Keyboard;